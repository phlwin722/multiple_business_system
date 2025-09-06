const TableDashboard = ({ rows = [], columns = [] }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 font-semibold uppercase tracking-wide"
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                className="px-6 py-4 text-center text-gray-500 italic"
                colSpan={columns.length}
              >
                No data available
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={index}
                className={`transition-colors duration-300 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-100`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableDashboard;
