const PlaceholderLoadingTeller = () => {
  return (
    <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <div
          key={index}
          className="flex flex-col bg-white p-4 rounded-lg shadow-md animate-pulse space-y-3"
        >
          <div className="bg-gray-300 h-40 w-full rounded-md" />
          <div className="bg-gray-300 h-4 w-3/4 rounded" />
          <div className="flex gap-2">
            <div className="bg-gray-300 h-4 w-2/3 rounded" />
            <div className="bg-gray-300 h-4 w-1/4 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="bg-gray-300 h-4 w-1/2 rounded" />
            <div className="bg-gray-300 h-4 w-1/3 rounded" />
          </div>
          <div className="bg-gray-300 h-4 w-4/5 rounded" />
          <div className="h-10 bg-blue-300 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default PlaceholderLoadingTeller;
