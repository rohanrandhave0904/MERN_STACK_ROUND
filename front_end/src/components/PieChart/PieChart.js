import React from "react";
import "./PieChart.css";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const PieChart = ({ data, month }) => {
  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: "Category Distribution",
        data: data.map((item) => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="pie-chart">
      <h2>Pie Chart: Stats of {month}</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
