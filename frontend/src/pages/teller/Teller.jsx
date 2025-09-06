import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";
import { useStateContext } from "../../contexts/ContextProvider";
import { FaTrashAlt } from "react-icons/fa";
import toastify from "../../components/toastify";
import Modal from "../../components/Modal";
import PlaceholderLoadingTeller from "../../components/PlaceholderLoadingTeller";
import { FaWallet } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";

const Teller = () => {
  const urlProduct = "/product";
  const { user } = useStateContext();

  const [product, setProduct] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [cartOrder, setCartOrder] = useState(false);
  const [countOrder, setCountOrder] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState(null);

  const URL = "/sale";

  const totalPrice = orderList.reduce(
    (sum, item) => sum + item.price * (item.orderQuantity || 1),
    0
  );

  const handleAddToCart = (product) => {
    const existingOrder = JSON.parse(localStorage.getItem("order") || "[]");
    const productIndex = existingOrder.findIndex((p) => p.id === product.id);
    let updateOrder = [...existingOrder];

    if (productIndex !== -1) {
      const currentQuantity = updateOrder[productIndex].orderQuantity || 1;

      if (currentQuantity + 1 > product.quantity) {
        toastify(
          "error",
          `Cannot add more than ${product.quantity} of ${product.product_name}.`
        );
        return;
      }

      updateOrder[productIndex].orderQuantity = currentQuantity + 1;
      toastify("success", `Added one more ${product.product_name}.`);
    } else {
      if (product.quantity < 1) {
        toastify("error", "Out of stock.");
        return;
      }
      setCountOrder((prev) => prev + 1);
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
    setCountOrder((prev) => Math.max(prev - 1, 0));
  };

  const handleClearOrder = () => {
    localStorage.removeItem("order");
    setOrderList([]);
    setCountOrder(0);
  };

  const handlePayOrder = async () => {
    try {
      setLoading(true);
      await axiosClient.post(`${URL}/create`, {
        order: orderList,
        user_id: user.user_id,
        total: totalPrice,
        payment_mode: paymentMode,
      });
      toastify("success", "Order submitted!");
      handleClearOrder();
      setPaymentMode(null)
      setCartOrder(false);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toastify("error", "Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (search = null) => {
    try {
      const response = await axiosClient.post(`${urlProduct}/index`, {
        business_id: user.business_id,
        user_id: user.user_id,
        product_name: search,
      });
      setProduct(response.data.data);
    } catch (error) {
      console.error(error);
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
    document.title = "Teller - Muibu";
    setCountOrder(stored.length);
  }, []);

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block ">
        <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
          <Modal
            isOpen={isModalOpen}
            title="Order confirmation"
            backgroundBtn="bg-blue-500 hover:bg-blue-600"
            messageBtn="Proceed, it"
            message="Are you sure you want to proceed this order? This action cannot be undone"
            onClose={() => setIsModalOpen(false)}
            onConfirm={handlePayOrder}
          />

          {/* Product Section */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            {/* Search bar */}
            <div className="sticky shadow top-0 bg-white z-10 px-4 flex items-center justify-between h-19">
              <div className="w-full flex gap-4">
                <div className="relative w-full">
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
            </div>

            {/* Product Grid */}
            {loadingScreen ? (
              <PlaceholderLoadingTeller />
            ) : product.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-6 pb-5">
                {product.map((products) => (
                  <div
                    className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between space-y-3"
                    key={products.id}
                  >
                    <div>
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
                    </div>
                    <div className="w-full">
                      {products.quantity > 0 ? (
                        <button
                          className="bg-blue-500 w-full text-white py-2 px-4 rounded hover:bg-blue-600"
                          onClick={() => handleAddToCart(products)}
                        >
                          Add to order
                        </button>
                      ) : (
                        <button
                          disabled
                          className="cursor-not-allowed w-full bg-gray-500 text-white py-2 px-4 rounded"
                        >
                          Out of stock
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-span-full flex justify-center items-center h-40">
                <p className="text-2xl font-medium text-gray-500">
                  No products found.
                </p>
              </div>
            )}
          </div>

          {/* Order Sidebar */}
          <div className="w-full md:w-80 xl:w-96 bg-gray-100 border-l border-gray-300 p-4 md:flex md:flex-col hidden">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Order List
              </h2>
              <button
                onClick={handleClearOrder}
                className="text-blue-500 font-semibold mb-4"
              >
                Clear
              </button>
            </div>
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

                <div className="mt-auto border-t border-gray-300 pt-4 space-y-3">
                  <div className="items-center">
                    <p className="text-gray-800 font-medium">
                      Mode of Payment:
                    </p>
                    <div className="flex w-full items-center justify-center gap-3 mt-1">
                      <button
                        onClick={() => setPaymentMode("Cash")}
                        className={`rounded-md py-2 w-full px-4 font-medium ${
                          paymentMode === "Cash"
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-black"
                        }`}
                      >
                        <div className="flex gap-2 text-center">
                          <BsCashCoin size={19} />
                          Cash
                        </div> 
                      </button>
                      <button
                        onClick={() => setPaymentMode("E-Wallet")}
                        className={`rounded-md w-full py-2 px-4 font-medium ${
                          paymentMode === "E-Wallet"
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-black"
                        }`}
                      >
                        <div className="flex gap-2 text-center">
                          <FaWallet size={19} />
                          E-wallet
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    Total: ₱{totalPrice.toFixed(2)}
                  </div>
                  <button
                    className={`w-full text-white py-2 rounded ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    } 
                    ${orderList.length > 0 ? "" : "cursor-not-allowed"}`}
                    onClick={() => {
                      if (orderList.length > 0) {
                        if (!paymentMode) {
                          toastify("error", "Please select a mode of payment");
                          return;
                        }
                        setIsModalOpen(true);
                      }
                    }}
                    disabled={loading}
                  >
                    Pay Order
                  </button>
                  <button
                    className="w-full bg-gray-300 font-medium text-black py-2 rounded hover:bg-gray-400"
                    onClick={handleClearOrder}
                  >
                    Clear Order
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-gray-500">No items in order yet.</p>
                </div>
                <div>
                  <div className="mt-auto border-t pt-4 space-y-3">
                    <div className="items-center">
                      <p className="text-gray-800 font-medium">
                        Mode of Payment:
                      </p>
                      <div className="flex w-full items-center justify-center gap-3 mt-1">
                        <button
                          onClick={() => setPaymentMode("Cash")}
                          className={`rounded-md py-2 w-full px-4 font-medium text-center ${
                            paymentMode === "Cash"
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-black"
                          }`}
                        >
                          <div className="flex gap-2">
                            <BsCashCoin size={19} />
                            Cash
                          </div>
                        </button>
                        <button
                          onClick={() => setPaymentMode("E-Wallet")}
                          className={`rounded-md text-center w-full py-2 px-4 font-medium ${
                            paymentMode === "E-Wallet"
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-black"
                          }`}
                        >
                          <div className="flex gap-2">
                            <FaWallet size={19} />
                            E-wallet
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      Total: ₱{totalPrice.toFixed(2)}
                    </div>
                    <button
                      className={`w-full text-white py-2 rounded ${
                        loading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      } ${orderList.length > 0 ? "" : "cursor-not-allowed"}`}
                      onClick={() => {
                        if (orderList.length > 0) {
                          if (!paymentMode) {
                            toastify(
                              "error",
                              "Please select a mode of payment"
                            );
                            return;
                          }
                          setIsModalOpen(true);
                        }
                      }}
                      disabled={loading}
                    >
                      Pay Order
                    </button>
                    <button
                      className="w-full bg-gray-300 font-medium text-black py-2 rounded hover:bg-gray-400"
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
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div
          className={`flex flex-col md:flex-row ${
            cartOrder ? "" : "h-[calc(100vh-64px)]"
          }`}
        >
          <Modal
            isOpen={isModalOpen}
            title="Order confirmation"
            backgroundBtn="bg-blue-500 hover:bg-blue-600"
            messageBtn="Proceed, it"
            message="Are you sure you want to proceed this order? This action cannot be undone"
            onClose={() => setIsModalOpen(false)}
            onConfirm={handlePayOrder}
          />

          {/* Product Section */}
          <div className={`flex-1 p-4 overflow-y-auto bg-gray-100`}>
            {/* Search bar */}
            <div className="sticky shadow top-0 bg-white z-10 px-4 flex items-center justify-between h-19">
              <div className="w-full flex gap-4">
                {cartOrder ? (
                  <>
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded-md"
                      onClick={() => setCartOrder(false)}
                    >
                      Product
                    </button>
                  </>
                ) : (
                  <>
                    <div className="relative w-full">
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
                        onClick={() => setCartOrder(true)}
                        className=" bg-blue-500 py-1 px-3 text-white rounded-md hover:bg-blue-600"
                      >
                        Cart Order
                      </button>
                      {countOrder > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white font-semibold animate-pulse rounded-full px-2 py-0.5 text-xs shadow-md">
                          {countOrder}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Product Grid */}
            {loadingScreen ? (
              <PlaceholderLoadingTeller />
            ) : product.length > 0 ? (
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-6 pb-5 ${
                  cartOrder ? "hidden" : ""
                }`}
              >
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
              <div
                className={`col-span-full flex justify-center items-center h-40 ${
                  cartOrder ? "hidden" : ""
                }`}
              >
                <p className="text-2xl font-medium text-gray-500">
                  No products found.
                </p>
              </div>
            )}
          </div>

          {/* Order Sidebar */}
          <div
            className={`w-full md:w-80 xl:w-96 bg-gray-100 border-l border-gray-300 p-4 md:flex md:flex-col ${
              cartOrder ? "" : "hidden"
            }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Order List
              </h2>
              <button
                onClick={handleClearOrder}
                className="text-blue-500 font-semibold mb-4"
              >
                Clear
              </button>
            </div>
            {orderList.length > 0 ? (
              <>
                <div className="space-y-3 h-[calc(100vh-450px)] pb-10 overflow-y-auto">
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

                <div className="mt-auto border-t border-gray-300 pt-4 space-y-3">
                  <div className="items-center">
                    <p className="text-gray-800 font-medium">
                      Mode of Payment:
                    </p>
                    <div className="flex w-full items-center justify-center gap-3 mt-1">
                      <button
                        onClick={() => setPaymentMode("Cash")}
                        className={`rounded-md py-2 w-full px-4 font-medium text-center ${
                          paymentMode === "Cash"
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-black"
                        }`}
                      >
                        <div className="flex gap-2">
                          <BsCashCoin size={19} />
                          Cash
                        </div>
                      </button>
                      <button
                        onClick={() => setPaymentMode("E-Wallet")}
                        className={`rounded-md w-full py-2 px-4 font-medium text-center ${
                          paymentMode === "E-Wallet"
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-black"
                        }`}
                      >
                        <div className="flex gap-2">
                          <FaWallet size={19} />
                          E-wallet
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    Total: ₱{totalPrice.toFixed(2)}
                  </div>
                  <button
                    className={`w-full text-white py-2 rounded ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }
                    ${orderList.length > 0 ? "" : "cursor-not-allowed"}`}
                    onClick={() => {
                      if (orderList.length > 0) {
                        if (!paymentMode) {
                          toastify("error", "Please select a mode of payment");
                          return;
                        }
                        setIsModalOpen(true);
                      }
                    }}
                    disabled={loading}
                  >
                    Pay Order
                  </button>
                  <button
                    className="w-full bg-gray-300 font-medium text-black py-2 rounded hover:bg-gray-400"
                    onClick={handleClearOrder}
                  >
                    Clear Order
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full justify-between">
                <div className=" h-[calc(100vh-450px)]">
                  <p className="text-gray-500">No items in order yet.</p>
                </div>
                <div>
                  <div className="mt-auto border-t pt-4 space-y-3">
                    <div className="items-center">
                      <p className="text-gray-800 font-medium">
                        Mode of Payment:
                      </p>
                      <div className="flex w-full items-center justify-center gap-3 mt-1">
                        <button
                          onClick={() => setPaymentMode("Cash")}
                          className={`rounded-md py-2 w-full px-4 font-medium ${
                            paymentMode === "Cash"
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-black"
                          }`}
                        >
                          <div className="flex gap-2">
                            <BsCashCoin size={19} />
                            Cash
                          </div>
                        </button>
                        <button
                          onClick={() => setPaymentMode("E-Wallet")}
                          className={`rounded-md w-full py-2 px-4 font-medium ${
                            paymentMode === "E-Wallet"
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-black"
                          }`}
                        >
                          <div className="flex gap-2">
                            <FaWallet size={19} />
                            E-wallet
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      Total: ₱{totalPrice.toFixed(2)}
                    </div>
                    <button
                      className={`w-full text-white py-2 rounded ${
                        loading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      } ${orderList.length > 0 ? "" : "cursor-not-allowed"}`}
                      onClick={() => {
                        if (orderList.length > 0) {
                          setIsModalOpen(true);
                        }
                      }}
                      disabled={loading}
                    >
                      Pay Order
                    </button>
                    <button
                      className="w-full bg-gray-300 font-medium text-black py-2 rounded hover:bg-gray-400"
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
      </div>
    </>
  );
};

export default Teller;
