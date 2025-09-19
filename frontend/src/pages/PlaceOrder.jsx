import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { useState } from "react";
import Footer from "../components/Footer";
import { useShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const {
    getCartItemsWithDetails,
    getCartAmount,
    delivery_charges,
    backendUrl,
    token,
    user,
    setCartItem,
    navigate,
  } = useShopContext();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields for COD
      if (
        method === "cod" &&
        (!formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.phone)
      ) {
        toast.error("Name, email, and phone are required for COD orders");
        return;
      }

      // Validate required fields for all orders
      if (
        !formData.street ||
        !formData.city ||
        !formData.state ||
        !formData.zipcode ||
        !formData.country
      ) {
        toast.error("Please complete all address fields");
        return;
      }

      const cartItems = getCartItemsWithDetails();

      let orderData = {
        address: formData, // All user information goes here
        items: cartItems.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.itemPrice,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          volume: item.volume,
          image: item.product.image && item.product.image[0],
        })),
        amount: getCartAmount() + delivery_charges,
      };

      // Add userId only if authenticated
      if (token && user) {
        orderData.userId = user._id;
      }

      // API call for Payment Method
      switch (method) {
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place/cod",
            orderData
          );

          if (response.data.success) {
            setCartItem({});
            toast.success("Order placed successfully!");
            navigate("/");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          if (!token) {
            toast.error("Please login to use Stripe payment");
            return;
          }

          const responseStripe = await axios.post(
            backendUrl + "/api/order/place/stripe",
            orderData,
            { headers: { token } }
          );

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="">
      {/* CONTAINER */}
      <form
        className="max-padding-container pt-20 py-10 bg-gradient-to-b from-gray-50 to-white"
        onSubmit={onSubmitHandler}
      >
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-12">
          {/* LEFT SIDE - Delivery Information */}
          <div className="flex-2 flex flex-col gap-3 text-[95%]">
            <Title title1={"Delivery"} title2={"Information"} />

            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                value={formData.firstName}
                name="firstName"
                type="text"
                placeholder="First Name *"
                className="ring-1 ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandler}
                value={formData.lastName}
                name="lastName"
                type="text"
                placeholder="Last Name *"
                className="ring-1 ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>

            <input
              onChange={onChangeHandler}
              value={formData.email}
              name="email"
              type="email"
              placeholder="Email Address *"
              className="ring-1 ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none"
              required
            />

            <input
              onChange={onChangeHandler}
              value={formData.phone}
              name="phone"
              type="text"
              placeholder="Phone Number *"
              className="ring-1 ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none"
              required
            />

            <input
              onChange={onChangeHandler}
              value={formData.street}
              name="street"
              type="text"
              placeholder="Street Address *"
              className="ring-1 ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none"
              required
            />

            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                value={formData.city}
                name="city"
                type="text"
                placeholder="City *"
                className="ring-1 ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandler}
                value={formData.state}
                name="state"
                type="text"
                placeholder="State *"
                className="ring-1 ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>

            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                value={formData.zipcode}
                name="zipcode"
                type="text"
                placeholder="Zip Code *"
                className="ring-1 ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandler}
                value={formData.country}
                name="country"
                type="text"
                placeholder="Country *"
                className="ring-1 ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div className="flex flex-1 flex-col">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CartTotal />

              {/* Payment Method */}
              <div className="my-6">
                <h3 className="bold-20 text-lg mb-5">
                  Payment <span>Method</span>
                </h3>
                <div className="flex gap-3">
                  <div
                    onClick={() => setMethod("stripe")}
                    className={`rounded-full px-4 py-2 border-2 cursor-pointer ${
                      method === "stripe"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Stripe
                  </div>
                  <div
                    onClick={() => setMethod("cod")}
                    className={`rounded-full px-4 py-2 border-2 cursor-pointer ${
                      method === "cod"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Cash On Delivery
                  </div>
                </div>

                {method === "stripe" && !token && (
                  <p className="text-red-500 text-sm mt-2">
                    Please login to use Stripe payment
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="btn-dark w-full"
                  disabled={method === "stripe" && !token}
                >
                  {method === "stripe" && !token
                    ? "Please Login First"
                    : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default PlaceOrder;
