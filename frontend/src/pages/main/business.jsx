// pages/business/index.jsx
import Table from "../../components/Table";

const Business = () => {
  const columns = [
    { name: "Name", key: "name" },
    { name: "Industry", key: "industry" },
    { name: "Location", key: "location" },
  ];

  const rows = [
    { id: '1', name: "Acme Corp", industry: "Technology", location: "San Francisco" },
    { id: '2', name: "GreenLeaf", industry: "Agriculture", location: "Iowa" },
    { id: '3', name: "Sunrise Bakery", industry: "Food & Beverage", location: "New York" },
  ];
  /* cont rows = [] */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Businesses</h1>
      <Table columns={columns} rows={rows} />
    </div>
  );
};

export default Business;
