import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/ContextProvider";
import { FaTrashAlt } from "react-icons/fa";
import toastify from "../../components/toastify";
import Modal from "../../components/Modal";
import PlaceholderLoadingTeller from "../../components/PlaceholderLoadingTeller";

const Teller = ({}) => {
  const urlProduct = "/product";

  const { user } = useStateContext();
  const [product, setProduct] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [payOrder, setPayOrder] = useState(false);
  const [countOrder, setCountOrder] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);

  const URL = "/sale";

  const totalPrice = orderList
    ? orderList.reduce(
        (sum, item) => sum + item.price * (item.orderQuantity || 1),
        0
      )
    : 0;

  const handleAddToCart = (product) => {
    const existingOrder = JSON.parse(localStorage.getItem("order") || "[]");
    const productIndex = existingOrder.findIndex((p) => p.id === product.id);
    let updateOrder = [...existingOrder];

    if (productIndex !== -1) {
      const currentQuantity = updateOrder[productIndex].orderQuantity || 1;

      if (currentQuantity + 1 > product.quantity) {
        toastify(
          "error",
          `Cannot add more than ${product.quantity} of "${product.product_name}".`
        );
        return;
      }

      updateOrder[productIndex].orderQuantity =
        (updateOrder[productIndex].orderQuantity || 1) + 1;

      toastify("success", `Added one more ${product.product_name}.`);
    } else {
      if (product.quantity < 1) {
        toastify("error", "Out of stock.");
        return;
      }
      setCountOrder(() => setCountOrder(countOrder + 1));
      updateOrder.push({ ...product, orderQuantity: 1 });

      toastify("success", `${product.product_name} added to your order.`);
    }

    localStorage.setItem("order", JSON.stringify(updateOrder));
    setOrderList(updateOrder);
  };

  const handleQuantityChange = (id, change) => {
    const updateOrder = orderList.map((item) => {
      if (item.id === id) {
        const newQty = (item.orderQuantity || 1) + change;

        if (newQty > item.quantity) {
          toastify(
            "error",
            `Cannot order more than ${item.quantity} of "${item.product_name}".`
          );
          return item;
        }

        return { ...item, orderQuantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    localStorage.setItem("order", JSON.stringify(updateOrder));
    setOrderList(updateOrder);
  };

  const handleRemoveFromOrder = (id) => {
    const updateOrder = orderList.filter((item) => item.id !== id);
    localStorage.setItem("order", JSON.stringify(updateOrder));
    setOrderList(updateOrder);
    setCountOrder(countOrder - 1);
  };

  const handleClearOrder = () => {
    localStorage.removeItem("order");
    setOrderList([]);
    setCountOrder(0);
  };

  const handlePayOrder = async () => {
    await axiosClient.post(`${URL}/create`, {
      order: orderList,
      user_id: user.id,
      total: totalPrice,
    });
    // Placeholder — replace with real backend request later
    toastify("success", "Order submitted!");
    handleClearOrder();
    setPayOrder(false);
    setIsModalOpen(false);
    fetchData();
  };

  const fetchData = async (search = null) => {
    try {
      const response = await axiosClient.post(`${urlProduct}/index`, {
        business_id: user.business_id,
        product_name: search,
      });
      setProduct(response.data.data);
    } catch (error) {
      console.log(error);
      toastify("error", "Something went wrong, Please try again.");
    } finally {
      setLoadingScreen(false);
    }
  };

  useEffect(() => {
    const delayedDebounce = setTimeout(() => {
      fetchData(searchValue);
    }, 500);
    return () => clearTimeout(delayedDebounce);
  }, [searchValue]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("order") || "[]");
    setOrderList(stored);
  }, []);

  return (
    <div className="flex h-full">
      <Modal
        isOpen={isModalOpen}
        title="Order confirmation"
        backgroundBtn="bg-green-500 hover:bg-green-600"
        messageBtn="Proceed"
        message="Are you sure you want to proceed this order? This action cannot be undone"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePayOrder}
      />

      {/* Product Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Search bar */}
        <div className="sticky shadow-lg top-0 bg-white z-10 px-4 flex items-center justify-between h-19">
          {/* Desktop view */}
          <div className="hidden md:block">
            <div className="relative w-full mr-15 sm:w-70">
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
                className={`absolute left-2 top-3 text-gray-500 transition-all pointer-events-none peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600 ${
                  searchValue ? "text-xs top-[4px] text-blue-600" : ""
                }`}
              >
                Search
              </label>
            </div>
          </div>

          {/* Mobile view */}
          <div className="md:hidden flex justify-between w-full">
            {payOrder ? (
              <div>
                <button
                  onClick={() => setPayOrder((prev) => !prev)}
                  className="text-sm bg-blue-500 py-3 px-4 text-white rounded hover:bg-blue-700"
                >
                  Add order
                </button>
              </div>
            ) : (
              <>
                <div className="relative w-full mr-5 md:mr-15 md:w-70">
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
                    className={`absolute left-2 top-3 text-gray-500 transition-all pointer-events-none peer-focus:text-xs peer-focus:top-1 peer-focus:text-blue-600 ${
                      searchValue ? "text-xs top-[4px] text-blue-600" : ""
                    }`}
                  >
                    Search
                  </label>
                </div>

                <div className="relative md:hidden">
                  <button
                    onClick={() => setPayOrder((prev) => !prev)}
                    className="bg-blue-500 px-2 py-4 rounded-lg text-white text-sm w-20 hover:bg-blue-700 shadow-lg transition-all duration-200"
                  >
                    Pay now
                  </button>
                  {countOrder > 0 && (
                    <span className="absolute -top-2 -right-1 bg-red-500 text-white text-sm font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {countOrder}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex justify-center">
          {loadingScreen ? (
            <PlaceholderLoadingTeller />
          ) : product.length > 0 ? (
            <div className="hidden md:grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-5 mt-6 pb-5">
              {product.map((products) => (
                <div
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-3"
                  key={products.id}
                >
                  <img
                    className="h-40 w-full object-cover rounded"
                    src={products.image}
                    alt={products.product_name}
                  />
                  <div className="text-gray-800 font-semibold">
                    {products.product_name}
                  </div>
                  <p className="text-sm text-gray-600">
                    Price: ₱{products.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Stock: {products.quantity}
                  </p>
                  {products.quantity > 0 ? (
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                      onClick={() => handleAddToCart(products)}
                    >
                      Add to order
                    </button>
                  ) : (
                    <button
                      disabled
                      className="cursor-not-allowed bg-gray-500 text-white py-2 px-4 rounded"
                    >
                      Out of stock
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full flex justify-center items-center h-40">
              <p className="text-xl text-gray-500">No products found.</p>
            </div>
          )}

          {/* Mobile view */}
          {payOrder ? (
            <div className="md:hidden h-[75vh] flex flex-col w-full mt-5 bg-gray-100 p-4 ">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Order List
              </h2>

              {orderList.length > 0 ? (
                <>
                  <div className="space-y-3 pb-10 overflow-y-auto">
                    {orderList.map((item) => (
                      <div
                        className="bg-white p-3 shadow rounded flex items-center space-x-4"
                        key={item.id}
                      >
                        <img
                          className="w-16 h-16 object-cover rounded"
                          src={item.image}
                          alt={item.product_name}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">
                            {item.product_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            ₱{Number(item.price).toFixed(2)}
                          </div>
                          <div className="flex items-center mt-2 space-x-2">
                            <button
                              className="px-2 py-1 bg-gray-200 rounded text-lg"
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              −
                            </button>
                            <span className="min-w-[24px] text-center">
                              {item.orderQuantity}
                            </span>
                            <button
                              className="px-2 py-1 bg-gray-200 rounded text-lg"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              disabled={item.orderQuantity >= item.quantity}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700 text-xl"
                          onClick={() => handleRemoveFromOrder(item.id)}
                          title="Remove from order"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Totals and Buttons */}
                  <div className="mt-auto border-t border-gray-300 pt-4 space-y-3">
                    <div className="text-lg font-semibold text-gray-800">
                      Total: ₱{totalPrice.toFixed(2)}
                    </div>
                    <button
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Pay Order
                    </button>
                    <button
                      className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                      onClick={handleClearOrder}
                    >
                      Clear Order
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-between">
                  {/* Totals and Buttons */}
                  <div className="h-[50vh]">
                    <p className="text-gray-500">No items in order yet.</p>
                  </div>
                  <div>
                    <div className="mt-auto border-t pt-4 space-y-3">
                      <div className="text-lg font-semibold text-gray-800">
                        Total: ₱{totalPrice.toFixed(2)}
                      </div>
                      <button
                        className="cursor-not-allowed text-gray-400 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        disabled
                      >
                        Pay Order
                      </button>
                      <button
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                        onClick={handleClearOrder}
                      >
                        Clear Order
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Mobile view list */
            <div className="md:hidden grid grid-cols-2 gap-5 mt-6 pb-5">
              {product.length > 0 ? (
                product.map((products) => (
                  <div
                    className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-3"
                    key={products.id}
                  >
                    <img
                      className="h-40 w-full object-cover rounded"
                      src={products.image}
                      alt={products.product_name}
                    />
                    <div className="text-gray-800 font-semibold">
                      {products.product_name}
                    </div>
                    <p className="text-sm text-gray-600">
                      Price: ₱{products.price}
                    </p>
                    <p className="text-sm text-gray-600">
                      Stock: {products.quantity}
                    </p>
                    {products.quantity > 0 ? (
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={() => handleAddToCart(products)}
                      >
                        Add to order
                      </button>
                    ) : (
                      <button
                        disabled
                        className="cursor-not-allowed bg-gray-500 text-white py-2 px-4 rounded"
                      >
                        Out of stock
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center h-40">
                  <p className="text-xl text-gray-500">No products found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Sidebar */}
      <div className="hidden md:flex flex-col w-96 md:w-70 xl:w-90 bg-gray-100 p-4 ">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Order List</h2>

        {orderList.length > 0 ? (
          <>
            <div className="space-y-3 pb-10 overflow-y-auto">
              {orderList.map((item) => (
                <div
                  className="bg-white p-3 shadow rounded flex items-center space-x-4"
                  key={item.id}
                >
                  <img
                    className="w-16 h-16 object-cover rounded"
                    src={item.image}
                    alt={item.product_name}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {item.product_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      ₱{Number(item.price).toFixed(2)}
                    </div>
                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded text-lg"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="min-w-[24px] text-center">
                        {item.orderQuantity}
                      </span>
                      <button
                        className="px-2 py-1 bg-gray-200 rounded text-lg"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        disabled={item.orderQuantity >= item.quantity}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 text-xl"
                    onClick={() => handleRemoveFromOrder(item.id)}
                    title="Remove from order"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>

            {/* Totals and Buttons */}
            <div className="mt-auto border-t border-gray-300 pt-4 space-y-3">
              <div className="text-lg font-semibold text-gray-800">
                Total: ₱{totalPrice.toFixed(2)}
              </div>
              <button
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={() => setIsModalOpen(true)}
              >
                Pay Order
              </button>
              <button
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                onClick={handleClearOrder}
              >
                Clear Order
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-screen justify-between">
            {/* Totals and Buttons */}
            <div>
              <p className="text-gray-500">No items in order yet.</p>
            </div>
            <div>
              <div className="mt-auto border-t pt-4 space-y-3">
                <div className="text-lg font-semibold text-gray-800">
                  Total: ₱{totalPrice.toFixed(2)}
                </div>
                <button
                  className="cursor-not-allowed text-gray-400 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  disabled
                >
                  Pay Order
                </button>
                <button
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                  onClick={handleClearOrder}
                >
                  Clear Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teller;
