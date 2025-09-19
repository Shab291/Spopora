import { currency } from "../App";
import { TfiPackage } from "react-icons/tfi";
import { useAdminContext } from "../context/adminContext";

const Orders = () => {
  const { orders, loading, error, statusHandler } = useAdminContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchAllOrders}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="px-2 ">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      <div className="flex flex-col gap-4">
        {!orders.length ? (
          <div className="text-center py-8">
            <TfiPackage className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-lg">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <article
              key={order._id}
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_0.5fr_1fr] gap-4 items-start p-4 text-gray-700 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flexCenter">
                <TfiPackage
                  className="text-3xl text-red-300"
                  aria-hidden="true"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-1">
                  <div className="font-medium">Items:</div>
                  <div className="flex flex-col">
                    {order.items.map((item, index) => (
                      <p key={`${order._id}-item-${index}`}>
                        {item.name} × {item.quantity}{" "}
                        <span className="text-gray-500">({item.color})</span>
                        {index < order.items.length - 1 && ","}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <p>
                    <span className="font-medium">Name: </span>
                    {`${order.address.firstName} ${order.address.lastName}`}
                  </p>
                  <p>
                    <span className="font-medium">Address: </span>
                    {[
                      order.address.street,
                      order.address.city,
                      order.address.state,
                      order.address.country,
                      order.address.zipcode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>
                    <span className="font-medium">Phone: </span>
                    {order.address.phone}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p>Total items: {order.items.length}</p>
                <p>Method: {order.paymentMethod}</p>
                <p
                  className={
                    order.payment ? "text-green-600" : "text-yellow-600"
                  }
                >
                  Payment: {order.payment ? "Done" : "Pending"}
                </p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>

              <p className="text-lg font-semibold">
                {currency}
                {order.amount.toLocaleString()}
              </p>

              <select
                value={order.status}
                onChange={(event) =>
                  statusHandler(order._id, event.target.value)
                }
                className="text-sm font-medium p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Order status"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
