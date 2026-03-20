import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export const DatePicker = (props) => (
  <input type="date" className="border p-2" {...props} />
);