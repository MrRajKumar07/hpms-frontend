import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export const StepIndicator = ({ steps, current }) => (
  <div className="flex gap-4">
    {steps.map((step, i) => (
      <div key={i} className={`flex items-center ${i === current ? "font-bold" : ""}`}>
        <span className="mr-1">{i + 1}.</span> {step}
      </div>
    ))}
  </div>
);