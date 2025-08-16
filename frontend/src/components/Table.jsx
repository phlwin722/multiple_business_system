import React, { useState } from "react";
import { MdDelete } from "react-icons/md";

const Table = ({ columns = [], rows = [] }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedRows.includes(id);

  const handleDeleteSelected = () => {
    console.log("Deleting selected IDs:", selectedRows);
  };

  const hasData = rows.length > 0;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Selected Rows Info */}
      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-b bg-blue-50 text-sm">
          <span className="text-blue-700 font-medium">
            {selectedRows.length} item{selectedRows.length > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
          >
            <MdDelete size={18} />
            Delete
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 border-b">
            <tr>
              <th className="px-4 py-3 w-10">
                {/* (Optional) Select All */}
              </th>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  {col.name}
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hasData ? (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={`transition hover:bg-gray-50 ${
                    isSelected(row.id) ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected(row.id)}
                      onChange={() => toggleRow(row.id)}
                      className="accent-blue-600"
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 space-x-2">
                    <button className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
