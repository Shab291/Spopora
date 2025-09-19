import React, { useState, useEffect } from "react";
import { useShopContext } from "../context/ShopContext";
import axios from "axios";
import Title from "../components/Title";
import FormatPrice from "../components/FormatPrice";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, user } = useShopContext();
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("Orders Data", ordersData);
  const loadUserOrders = async () => {
    try {
      setLoading(true);
      if (!token) {
        setOrdersData([]);
        setLoading(false);
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        { userId: user._id }, // Send userId in the body
        { headers: { token } }
      );

      if (response.data.success) {
        processOrdersData(response.data.orders);
      }
    } catch (error) {
      console.error("User orders loading error:", error);
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const processOrdersData = (orders) => {
    // Process full orders, not individual items
    setOrdersData(orders.reverse()); // Keep the full order objects
  };

  // Refresh orders every 30 seconds to get status updates
  useEffect(() => {
    if (token) {
      loadUserOrders();

      // Set up interval to refresh orders
      const interval = setInterval(loadUserOrders, 30000);

      return () => clearInterval(interval);
    }
  }, [token]);

  // Manual refresh button
  const handleRefresh = () => {
    loadUserOrders();
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white pt-16 mb-16 min-h-screen">
        <div className="max-padding-container py-10">
          <Title title1={"Order"} title2={"List"} title1Styles={"h2"} />
          <div className="text-center py-10">
            <p>Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-b from-gray-50 to-white pt-16 mb-16 ">
        {/* CONTAINER */}
        <div className="max-padding-container py-10">
          <div className="flex justify-between items-center mb-6">
            <Title title1={"Order"} title2={"List"} title1Styles={"h2"} />
            <button onClick={handleRefresh} className="btn-dark !px-4 !py-2">
              Refresh Orders
            </button>
          </div>

          {!token ? (
            <div className="bg-white p-6 rounded-lg text-center">
              <h4 className="h4 text-gray-600">
                Please login to view your orders
              </h4>
              <p className="text-gray-500 mt-2">
                You need to be logged in to see your order history
              </p>
            </div>
          ) : !ordersData.length ? (
            <div className="bg-white p-6 rounded-lg text-center">
              <h4 className="h4 text-gray-600">No orders found</h4>
              <p className="text-gray-500 mt-2">
                You haven't placed any orders yet
              </p>
            </div>
          ) : (
            ordersData.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 mt-4 rounded-lg shadow"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.date).toLocaleDateString()} at{" "}
                      {new Date(order.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`flex items-center justify-center px-2 py-1 rounded-full text-sm font-medium gap-x-3 ${
                        order.status === "Delivered"
                          ? "bg-green-200 text-green-800"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : order.status === "Packing"
                          ? "bg-blue-200 text-blue-800"
                          : order.status === "Shipped"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <span
                        className={`p-1 rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-500"
                            : order.status === "Cancelled"
                            ? "bg-red-500 "
                            : order.status === "Packing"
                            ? "bg-blue-500"
                            : order.status === "Shipped"
                            ? "bg-yellow-500"
                            : "bg-gray-500 "
                        }`}
                      ></span>
                      <div>{order.status}</div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Payment: {order.payment ? "Paid" : "Pending"} (
                      {order.paymentMethod})
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-3 bg-gray-50 rounded"
                    >
                      {/* IMAGE */}
                      <div className="flex gap-6">
                        <img
                          src={item.image}
                          alt="Ordered-Item-Image"
                          className="sm:w-24 rounded-lg aspect-square object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>
                            Price: <FormatPrice price={item.price} />
                          </p>
                          <p>Quantity: {item.quantity}</p>
                          {item.color && <p>Color: {item.color}</p>}
                          {item.size && <p>Size: {item.size}</p>}
                          {item.volume && <p>Volume: {item.volume}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          <FormatPrice price={item.price * item.quantity} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">
                      Shipping to: {order.address?.street},{" "}
                      {order.address?.city}, {order.address?.state}{" "}
                      {order.address?.zipcode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      Total: <FormatPrice price={order.amount} />
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
