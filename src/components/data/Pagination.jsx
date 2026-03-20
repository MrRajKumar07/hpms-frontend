import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export const Pagination = ({ page, totalPages, onPageChange }) => (
  <div className="flex gap-2">
    <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>Prev</button>
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        className={page === i + 1 ? "font-bold" : ""}
        onClick={() => onPageChange(i + 1)}
      >
        {i + 1}
      </button>
    ))}
    <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
  </div>
);