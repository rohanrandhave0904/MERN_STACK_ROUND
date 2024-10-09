import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionsTable from "./components/TransTable/TransactionsTable";
import Statistics from "./components/Statistics/Statistics";
import BarChart from "./components/BarChart/BarChart";
import PieChart from "./components/PieChart/PieChart";
import "./App.css";

const App = () => {
  const [month, setMonth] = useState("March");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCombinedData();
  }, [month, page, search]);

  const fetchCombinedData = async () => {
    const response = await axios.get(`/api/combined`, {
      params: { month, page, search },
    });
    setTransactions(response.data.transactions);
    setStatistics(response.data.statistics);
    setBarChartData(response.data.barChart);
    setPieChartData(response.data.pieChart);
  };

  return (
    <div className="App">
      <h1>Transaction Dashboard</h1>
      <div className="dash">
        <div className="month">
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="search">
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <TransactionsTable transactions={transactions} month={month} />
      <Statistics statistics={statistics} month={month} />
      <BarChart data={barChartData} month={month} />
      <PieChart data={pieChartData} month={month} />
    </div>
  );
};

export default App;
