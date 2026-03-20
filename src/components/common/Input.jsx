import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export const Input = ({ label, error, type = "text", register, name, ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      {label && <label>{label}</label>}
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          className="border p-2 w-full"
          {...(register ? register(name) : {})}
          {...props}
        />
        {isPassword && (
          <span
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"}
          </span>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
