import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export const DataTable = ({ columns, data = [], loading }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = data.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <div>Loading table...</div>;

  return (
    <div>
      <input
        placeholder="Search..."
        className="border p-2 mb-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div>No data found</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.accessor}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.accessor}>{row[col.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex gap-2 mt-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>{page}</span>
        <button
          disabled={page * pageSize >= filtered.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
