import { useState, useEffect } from "react";
import { useShopContext } from "../context/ShopContext";
import FormatePrice from "../components/FormatPrice";
import { FaMinus, FaPlus } from "react-icons/fa";
import { LiaWindowCloseSolid } from "react-icons/lia";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState([]);
  const {
    products,
    cartItem,
    getCartCount,
    updateQuantity,
    removeFromCart,
    getCartItemsWithDetails,
    navigate,
    user,
    getProductPrice,
  } = useShopContext();

  useEffect(() => {
    if (products.length > 0) {
      const items = getCartItemsWithDetails();
      setCartItemsWithDetails(items);
    }
  }, [cartItem, products, getCartItemsWithDetails]);

  const increment = (itemKey) => {
    const item = cartItemsWithDetails.find((item) => item.itemKey === itemKey);
    if (item) {
      const newQuantity = item.quantity + 1;
      updateQuantity(itemKey, newQuantity);
    }
  };

  const decrement = (itemKey) => {
    const item = cartItemsWithDetails.find((item) => item.itemKey === itemKey);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateQuantity(itemKey, newQuantity);
    }
  };

  const removeItem = (itemKey) => {
    removeFromCart(itemKey);
  };

  const placeOrder = () => {
    if (cartItemsWithDetails.length === 0) {
      toast.error("Your Cart is Empty, Please select items to checkout");
    } else {
      navigate("/place-order");
    }
  };

  const getAttributeDisplay = (item) => {
    const attributes = [];

    if (item.color) attributes.push(`Color: ${item.color}`);
    if (item.size) attributes.push(`Size: ${item.size}`);
    if (item.volume) attributes.push(`Volume: ${item.volume}`);

    return attributes.join(" • ");
  };

  // Helper function to get the actual unit price for an item
  const getUnitPrice = (item) => {
    // Use the itemPrice if available (from getCartItemsWithDetails)
    if (item.itemPrice) {
      return item.itemPrice;
    }

    // Fallback: calculate price based on volume
    if (
      item.volume &&
      item.product.volumePricing &&
      item.product.volumePricing[item.volume]
    ) {
      return item.product.volumePricing[item.volume];
    }

    // Default to product price
    return item.product.price;
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white pt-16">
      <div className="max-padding-container py-10 min-h-[75vh]">
        {/* TITLE */}
        <div className="flexStart gap-x-4">
          <Title title1={"Cart"} title2={"List"} title1Styles={"h3"} />

          <p className="medium-15 text-gray-600 relative bottom-1.5">
            <span className="bold-20">
              Hi! {user && user.name ? user?.name : "Guest"}
            </span>{" "}
            you have ({getCartCount()} Items) in your cart.
          </p>
        </div>

        {/* CART ITEMS */}
        <div className="mt-6">
          {cartItemsWithDetails.length === 0 ? (
            <div className="bg-white p-6 rounded-xl text-center">
              <h4 className="h4 text-gray-600">Your cart is empty</h4>
              <button
                className="btn-dark mt-4 cursor-pointer"
                onClick={() => navigate("/collection")}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItemsWithDetails.map((item, i) => {
              const unitPrice = getUnitPrice(item);
              const totalPrice = unitPrice * item.quantity;

              return (
                <div
                  key={item.itemKey}
                  className="bg-white p-4 mb-3 rounded-xl shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                    <img
                      src={item.product.image[0]}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />

                    <div className="flex flex-col w-full flex-1">
                      <div className="flexBetween">
                        <h4 className="h4 !my-0 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <LiaWindowCloseSolid
                          className="cursor-pointer hover:text-red-500 transition-colors"
                          size={20}
                          onClick={() => removeItem(item.itemKey)}
                        />
                      </div>

                      {/* Attributes Display */}
                      <div className="mt-2">
                        <div className="text-sm text-gray-600">
                          {getAttributeDisplay(item)}
                        </div>
                      </div>

                      <div className="flexBetween pt-4">
                        <div className="flex items-center ring-1 ring-slate-900/5 rounded-full overflow-hidden bg-slate-100">
                          <button
                            className="p-1.5 bg-white text-slate-700 rounded-full shadow-md hover:bg-slate-50 transition-colors"
                            onClick={() => decrement(item.itemKey)}
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <p className="px-3 medium-16 min-w-[2rem] text-center">
                            {item.quantity}
                          </p>
                          <button
                            className="p-1.5 bg-white text-slate-700 rounded-full shadow-md hover:bg-slate-50 transition-colors"
                            onClick={() => increment(item.itemKey)}
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                        <h4 className="h4">
                          <FormatePrice price={totalPrice} />
                        </h4>
                      </div>

                      {/* Price per unit */}
                      <div className="text-right text-sm text-gray-500 mt-1">
                        {item.quantity > 1 && (
                          <span>
                            {item.quantity} × <FormatePrice price={unitPrice} />
                          </span>
                        )}
                        {item.volume && (
                          <div className="text-xs text-gray-400">
                            {item.volume} size
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* CART TOTAL & CHECKOUT */}
        {cartItemsWithDetails.length > 0 && (
          <div className="flex my-20">
            <div className="w-full sm:w-[450px] ml-auto">
              <CartTotal />
              <button
                className="btn-dark mt-7 w-full hover:bg-slate-800 transition-colors py-3 text-lg"
                onClick={placeOrder}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
};

export default Cart;
