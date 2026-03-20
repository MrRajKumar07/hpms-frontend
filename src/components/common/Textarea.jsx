import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export const Textarea = ({ label, error, rows = 3, ...props }) => (
  <div>
    {label && <label>{label}</label>}
    <textarea rows={rows} className="border p-2 w-full" {...props} />
    {error && <p className="text-red-500">{error}</p>}
  </div>
);