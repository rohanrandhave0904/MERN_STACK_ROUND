const axios = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const Trans = require("./model/model");

const app = express();
app.use(express.json());

//////////////Function to initialize db/////////////////
const initialize_DB = async () => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const transactions = response.data.map((i) => ({
      id: i.id,
      title: i.title,
      description: i.description,
      price: i.price,
      category: i.category,
      image: i.image,
      sold: i.sold,
      dateOfSale: new Date(i.dateOfSale),
    }));

    await Trans.deleteMany({});

    if (Array.isArray(transactions) && transactions.length > 0) {
      await Trans.insertMany(transactions);
      console.log("Database initialize successfully");
    } else {
      console.error("Seed data is not in the expected format");
    }
  } catch (error) {
    console.error("Error in initializing database:", error);
  }
};

///////////mongo db connection setup/////////////
try {
  mongoose.connect("mongodb://localhost:27017/userdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected to userDB");
  initialize_DB();
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
}

/////////////////////////////////////////////////////////////////

////////////////api for trans//////////////
app.get("/api/transactions", async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;
  const monthIndex = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;

  let query = {
    $expr: {
      $eq: [{ $month: "$dateOfSale" }, monthIndex],
    },
  };

  if (search) {
    query = {
      ...query,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: parseFloat(search) },
      ],
    };
  }

  const transactions = await Trans.find(query)
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage));

  res.json(transactions);
  console.log(transactions);
});

/////////////////api for statitics of trans//////////////////
app.get("/api/statistics", async (req, res) => {
  const { month } = req.query;

  const monthIndex = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;

  try {
    const totalSales = await Trans.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthIndex],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" },
          soldItems: { $sum: { $cond: ["$sold", 1, 0] } },
          unsoldItems: { $sum: { $cond: ["$sold", 0, 1] } },
        },
      },
    ]);

    if (!totalSales.length) {
      return res.json({ totalSaleAmount: 0, soldItems: 0, unsoldItems: 0 });
    }

    res.json(totalSales[0]);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

//////////////////api for bar chart////////////////////
app.get("/api/bar-chart", async (req, res) => {
  const { month } = req.query;

  const monthIndex = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;

  const priceRanges = await Trans.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, monthIndex],
        },
      },
    },
    {
      $bucket: {
        groupBy: "$price",
        boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 10000],
        default: "other",
        output: { count: { $sum: 1 } },
      },
    },
  ]);

  res.json(priceRanges);
});

/////////////////api for pir chart//////////////
app.get("/api/pie-chart", async (req, res) => {
  const { month } = req.query;

  const monthIndex = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;

  const categoryDistribution = await Trans.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, monthIndex],
        },
      },
    },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  res.json(categoryDistribution);
});

/////////////combined api/////////////////

app.get("/api/combined", async (req, res) => {
  const { month } = req.query;

  try {
    const transactions = await axios.get(
      `http://localhost:1234/api/transactions?month=${month}`
    );
    const statistics = await axios.get(
      `http://localhost:1234/api/statistics?month=${month}`
    );
    const barChart = await axios.get(
      `http://localhost:1234/api/bar-chart?month=${month}`
    );
    const pieChart = await axios.get(
      `http://localhost:1234/api/pie-chart?month=${month}`
    );

    res.json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(4040).json({ error: "Failed to fetch data" });
  }
});

app.listen(1234, () => {
  console.log("Server Running");
});
