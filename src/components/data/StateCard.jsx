import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export const StatCard = ({ label, value, delta }) => (
  <div className="p-4 shadow rounded">
    <p>{label}</p>
    <h2 className="text-xl font-bold">{value}</h2>
    {delta && (
      <p className={delta > 0 ? "text-green-500" : "text-red-500"}>
        {delta > 0 ? "+" : ""}{delta}%
      </p>
    )}
  </div>
);