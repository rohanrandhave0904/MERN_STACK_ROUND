import React from "react";
import "./Statistics.css";

const Statistics = ({ statistics, month }) => {
  return (
    <div>
      <div className="statistics">
        <h2>Statistics of {month}</h2>
        <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
        <p>Total Sold Items: {statistics.soldItems}</p>
        <p>Total Unsold Items: {statistics.unsoldItems}</p>
      </div>
    </div>
  );
};

export default Statistics;
