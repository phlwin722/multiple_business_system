import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import axiosClient from "../axiosClient";
import { useStateContext } from "../contexts/ContextProvider";
import toastify from "./toastify";
import { CiSearch } from "react-icons/ci";
import { MdOutlineBusiness } from "react-icons/md";
import { FaTrashRestore } from "react-icons/fa";

const Table = ({ columns = [], rows = [], url, fetchData, type, archive }) => {
  const navigate = useNavigate();
  const { user } = useStateContext();

  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [messageBtn, setMessageBtn] = useState(null);
  const [backgroundBtn, setBackgroundBtn] = useState(null);
  const [listBusiness, setListBusiness] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const paginatedRows = rows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isSelected = (id) => selectedRows.includes(id);

  const openDeleteModal = (id = null) => {
    setDeletingId(id);
    setMessageBtn("Delete");
    setBackgroundBtn("bg-red-500 hover:bg-red-600");
    setConfirmation("Delete Confirmation");
    setMessage(
      "Are you sure you want to delete this item? This action cannot be undone."
    );
    setIsModalOpen(true);
  };

  const openRestoreModal = (id = null) => {
    setDeletingId(id);
    setMessageBtn("Restore");
    setBackgroundBtn("bg-green-500 hover:bg-green-600");
    setConfirmation("Restore Confirmation");
    setMessage(
      "Are you sure you want to restore this item? This action cannot be undone."
    );
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const idsToDelete = deletingId ? [deletingId] : selectedRows;
      const response = await axiosClient.post(`${url}/delete`, {
        ids: idsToDelete,
      });

      if (response.data.message) {
        toastify("success", "Deleted successfully");
        setMessageBtn("");
        setBackgroundBtn("");
        setMessageBtn("");
        setConfirmation("");
        setIsModalOpen(false);
        setDeletingId(null);
        setSelectedRows([]);
        fetchData();
      }
    } catch (error) {
      if (error.response.status === 400) {
        setMessageBtn("");
        setBackgroundBtn("");
        setMessageBtn("");
        setConfirmation("");
        setIsModalOpen(false);
        setDeletingId(null);
        setSelectedRows([]);
        toastify("error", "Cannot delete businesses with related data.");
      }
      console.log(error);
    }
  };

  const handleRestore = async () => {
    try {
      const idsToRestore = deletingId ? [deletingId] : selectedRows;
      const response = await axiosClient.post(`${url}/restore`, {
        ids: idsToRestore,
      });

      if (response.data.message) {
        toastify("success", "Restored successfully");
        setMessageBtn("");
        setBackgroundBtn("");
        setMessageBtn("");
        setConfirmation("");
        setIsModalOpen(false);
        setDeletingId(null);
        setSelectedRows([]);
        fetchData();
      }
    } catch (error) {
      setIsModalOpen(false);
      setDeletingId(null);
      setSelectedRows([]);
      fetchData();
    }
  };

  const handleAddForm = async () => {
    if (type) {
      if (user.position != "Manager") {
        if (listBusiness.length == 0) {
          if (url === "/employee") {
            toastify("error", "Please create business to proceed add employee");
          } else if (url === "/product") {
            toastify("error", "Please create business to proceed add product");
          }
        } else {
          navigate(`${url}/form`);
        }
      } else {
        navigate(`${url}/form`);
      }
    } else {
      navigate(`${url}/form`);
    }
  };

  const handleEditForm = async (id) => {
    const generateCodeWithID = (id) => {
      const random = Math.random().toString(36).substring(2, 8); // 6-char random
      const combined = `${random}|${id}`;
      return btoa(combined); // Base64 encode
    };

    const code = generateCodeWithID(id); // Result: "d0hkeXw1"
    navigate(`${url}/form/${code}`);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(selectedBusinessId, searchValue);
      setCurrentPage(1); // Reset to first page
    }, 500); // delay in ms

    return () => clearTimeout(delayDebounce); // cleanup
  }, [searchValue, selectedBusinessId]); // run when either changes

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        if (type) {
          if (user.position != "Manager") {
            const response = await axiosClient.post(`${url}/fetchBusinesses`, {
              user_id: user.user_id,
            });

            if (response.data.data) {
              setListBusiness(response.data.data);
            }
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
        title={confirmation}
        backgroundBtn={backgroundBtn}
        messageBtn={messageBtn}
        message={message}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          if (messageBtn === "Delete") {
            handleDelete();
          } else if (messageBtn === "Restore") {
            handleRestore();
          }
        }}
      />

      <div className="mb-5 bg-white rounded-lg shadow-md py-3 px-3 flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center">
        <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
          {type && user.position != "Manager" && (
            <div className="relative w-full sm:w-52">
              <MdOutlineBusiness className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none" />
              <select
                id="business"
                value={selectedBusinessId}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
                className="peer block w-full appearance-none border border-gray-300 bg-white pl-10 p-2 pt-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" hidden></option>
                <option value="0">All</option>
                {listBusiness.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.business_name}
                  </option>
                ))}
              </select>
              <label
                htmlFor="business"
                className={`absolute left-10 top-3 text-gray-500 transition-all pointer-events-none peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600 ${
                  selectedBusinessId ? "text-xs top-[4px] text-blue-600" : ""
                }`}
              >
                Select Business
              </label>
            </div>
          )}
          <div className="relative w-full sm:w-64">
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />

            <input
              type="search"
              id="search"
              autoComplete="off"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="peer block w-full border border-gray-300 bg-white p-2 pl-10 pt-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
            />
            <label
              htmlFor="search"
              className={`absolute left-10 top-3 text-gray-500 transition-all pointer-events-none peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600 ${
                searchValue ? "text-xs top-[4px] text-blue-600" : ""
              }`}
            >
              Search
            </label>
          </div>
        </div>

        {/* Add Button */}
        {!archive && (
          <div className="w-full sm:w-auto">
            <button
              onClick={handleAddForm}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 rounded-lg py-2 px-4 text-white transition"
            >
              Add
            </button>
          </div>
        )}
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
              className={`flex items-center cursor-pointer gap-1 transition. ${
                archive
                  ? "text-green-500 hover:text-green-600"
                  : "text-red-500 hover:text-red-600"
              }`}
            >
              {archive ? (
                <>
                  <FaTrashRestore size={18} />
                  Restore
                </>
              ) : (
                <>
                  <MdDelete size={18} />
                  Delete
                </>
              )}
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left overflow-x-auto border-b border-gray-300">
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
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition hover:bg-blue-100 ${
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
                        ) : col.key === "quantity" ? (
                          row[col.key] === 0 ? (
                            <p className="text-red-500 font-semibold">
                              Out of stock
                            </p>
                          ) : (
                            row[col.key]
                          )
                        ) : (
                          row[col.key]
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 space-x-2">
                      {!archive ? (
                        <>
                          <button
                            onClick={() => handleEditForm(row.id)}
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
                        </>
                      ) : (
                        <button
                          className=" cursor-pointer px-3 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600 transition"
                          onClick={() => openRestoreModal(row.id)}
                        >
                          Restore
                        </button>
                      )}
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
          {paginatedRows.length > 0 && (
            <div className="flex justify-center mt-4 pb-4 flex-wrap gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === page
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;
