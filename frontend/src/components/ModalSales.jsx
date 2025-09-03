const ModalSales = ({ isOpen, rows = [], title, onClose }) => {
  if (!isOpen) return null;

  const total = rows.reduce(
    (sum, item) => sum + parseFloat(item.price) * parseInt(item.order_quantity),
    0
  );
  return (
    <div
      className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.3)] flex items-center justify-center py-5 px-5 sm:px-30 md:px-40 lg:px-70 xl:px-100 2xl:px-190"
      onClick={onClose}
    >
      <div className="bg-white rounded-xl w-full shadow-2xl p-6 max-h-[90vh] relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-md xl:text-2xl font-semibold text-gray-800 mb-6 text-center">
          {title}
        </h2>

        <div className="overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
          {rows.length > 0 ? (
            rows.map((sales) => (
              <>
                <div
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-2 md:p-4 mb-3 hover:bg-gray-100 transition"
                  key={sales.id}
                >
                  <div className="flex items-center gap-2 md:gap-4">
                    <img
                      src={sales.image}
                      alt={sales.product_name}
                      className="h-16 w-16 rounded object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {sales.product_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        x{sales.order_quantity} ₱
                        {parseFloat(sales.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-md lg:text-lg font-semibold text-gray-800">
                    ₱{parseFloat(sales.price) * parseInt(sales.order_quantity)}
                  </p>
                </div>
              </>
            ))
          ) : (
            <div className="h-[30vh] flex items-center justify-center">
              <p className="text-center font-medium text-gray-700 text-2xl">No data found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <p className="text-xl font-semibold text-gray-700">
            Total: ₱{total.toFixed(2)}
          </p>
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSales;
