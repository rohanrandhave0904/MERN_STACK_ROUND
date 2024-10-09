import React, { useState, useEffect } from "react";
import "./TransactionsTable.css";

const TransactionsTable = ({ transactions, month }) => {
  const [page, setPage] = useState(1);
  return (
    <div className="transTable">
      <h2>Transactions of {month}</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.sold ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="page">
        <button
          className="prev"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button className="next" onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
