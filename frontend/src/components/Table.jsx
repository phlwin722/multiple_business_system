import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/ContextProvider";
import toastify from "./toastify";

const Table = ({ columns = [], rows = [], url, fetchData, type }) => {
  const navigate = useNavigate();
  const { user } = useStateContext();

  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [listBusiness, setListBusiness] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState("");

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

  const handleAddForm = async () => {
    if (type) {
      if (listBusiness.length == 0) {
        if (url === '/employee') {
          toastify("error", "Please create business to proceed add employee");
        } else if (url === '/product') {
          toastify("error", "Please create business to proceed add product");
        }
      } else {
        navigate(`${url}/form`);
      }
    } else {
      navigate(`${url}/form`);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (type) {
        fetchData(selectedBusinessId, searchValue);
        console.log('erch', searchValue)
      }
    }, 500); // delay in ms

    return () => clearTimeout(delayDebounce); // cleanup
  }, [searchValue, selectedBusinessId]); // run when either changes

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        if (type) {
          const response = await axiosClient.post(`${url}/fetchBusinesses`, {
            user_id: user.id,
          });

          if (response.data.data) {
            setListBusiness(response.data.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchBusinesses();
  }, [type]);

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
            <div className="space-x-4  flex">
              {/* Select with Floating Label */}
              <div className="relative w-full md:w-52">
                <select
                  id="business"
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="peer block w-full appearance-none border border-gray-300 bg-white p-2 pt-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {listBusiness.length > 0 ? (
                    <>
                      <option value="" hidden></option>
                      <option value="0">All</option>
                      {listBusiness.map((business) => (
                        <option
                          className="border border-gray-300 w-50"
                          key={business.id}
                          value={business.id}
                        >
                          {business.business_name}
                        </option>
                      ))}
                    </>
                  ) : (
                    <>
                      <option value="" hidden></option>
                    </>
                  )}
                </select>
                <label
                  htmlFor="business"
                  className={`
             absolute left-2 top-3  text-gray-500 transition-all pointer-events-none
            peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600
            ${selectedBusinessId ? "text-xs top-[4px] text-blue-600" : ""}
          `}
                >
                  Select Business
                </label>
              </div>

              {/* Search with Floating Label */}
              <div className="relative w-full md:w-64">
                <input
                  type="search"
                  id="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="peer block w-full border border-gray-300 bg-white p-2 pt-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=""
                />
                <label
                  htmlFor="search"
                  className={`
            absolute left-2 top-3  text-gray-500 transition-all pointer-events-none
            peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600
            ${searchValue ? "text-xs top-[4px] text-blue-600" : ""}
          `}
                >
                  Search
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="ml-3">
          <button
            onClick={handleAddForm}
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
          <table className="w-full text-sm text-left overflow-x-auto">
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
