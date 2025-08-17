import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/ContextProvider";

const Table = ({ columns = [], rows = [], url, fetchData, type }) => {
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedRows.includes(id);

  const openDeleteModal = (id = null) => {
    setDeletingId(id); // set  to null or bulk id for single
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const idsToDelete = deletingId ? [deletingId] : selectedRows;
      const response = await axiosClient.post(`${url}/delete`, {
        ids: idsToDelete,
      });

      if (response.data.message) {
        setIsModalOpen(false);
        setDeletingId(null);
        setSelectedRows([]);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect( async() => {
    if (type) {
      const response = await axiosClient.post(`${url}/fetchBusinesses`, {
        user_id
      })
    }
  },[type])

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        title="Delete"
        message="Are you sure do you want to delete?"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />

      <div className="mb-5 bg-white rounded-lg shadow-md py-3 px-3 flex justify-between items-center">
        <div>
          {type && (
            <div className="space-x-3">
              <select className="w-50 border border-gray-300 p-2 rounded-md">
                <option></option>
              </select>

              <input
                type="search"
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Search..."
              />
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => navigate(`${url}/form`)}
            className="bg-blue-500 hover:bg-blue-600 rounded-lg py-2 px-4 text-white transition cursor-pointer"
          >
            {" "}
            Add{" "}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Selected Rows Info */}
        {selectedRows.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-300 bg-blue-50 text-sm">
            <span className="text-blue-700 font-medium">
              {selectedRows.length} item{selectedRows.length > 1 ? "s" : ""}{" "}
              selected
            </span>
            <button
              onClick={() => openDeleteModal(null)}
              className="flex items-center cursor-pointer gap-1 text-red-600 hover:text-red-800 transition"
            >
              <MdDelete size={18} />
              Delete
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-300">
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
              {rows.length > 0 ? (
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
                        className="accent-blue-600  cursor-pointer "
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-gray-700">
                        {col.key === "image" ? (
                          <img
                            src={row[col.key]}
                            alt={row.business_name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          row[col.key]
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => navigate(`${url}/form/${row.id}`)}
                        className=" cursor-pointer px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(row.id)}
                        className=" cursor-pointer px-3 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition"
                      >
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
    </div>
  );
};

export default Table;
