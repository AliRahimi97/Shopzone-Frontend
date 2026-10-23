import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setCustomerName(data.customerName);
        setItems(data.items);
      });
  }, [id]);

  const handleUpdate = () => {
    const updatedOrder = { ...order, customerName, items };
    fetch(`http://localhost:5000/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedOrder),
    }).then(() => navigate("/orders"));
  };

  if (!order) {
    return (
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-300 text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Pencil className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Order</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Customer Name:
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Product Orders:
          </h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow-sm">
                <p className="text-gray-800 dark:text-white font-medium">
                  {item.productName}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <label className="text-sm text-gray-600 dark:text-gray-300">Count:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].quantity = parseInt(e.target.value);
                      setItems(newItems);
                    }}
                    className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
