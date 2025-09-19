// components/CartTotal.jsx
import { useShopContext } from "../context/ShopContext";
import FormatePrice from "./FormatPrice";

const CartTotal = () => {
  const { getCartAmount, delivery_charges, currency } = useShopContext();
  const cartAmount = getCartAmount();
  const totalAmount = cartAmount + delivery_charges;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="h3 mb-6 text-center">Cart Total</h3>

      <div className="space-y-4">
        <div className="flexBetween">
          <span className="medium-16">Subtotal:</span>
          <span className="medium-16">
            <FormatePrice price={cartAmount} />
          </span>
        </div>

        <div className="flexBetween">
          <span className="medium-16">Shipping:</span>
          <span className="medium-16">
            {cartAmount > 0 ? (
              <FormatePrice price={delivery_charges} />
            ) : (
              "Free"
            )}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flexBetween">
            <span className="bold-18">Total:</span>
            <span className="bold-18 text-green-600">
              <FormatePrice price={totalAmount} />
            </span>
          </div>
        </div>
      </div>

      {cartAmount > 99 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-green-700 text-sm text-center">
            🎉 You qualify for free shipping!
          </p>
        </div>
      )}
    </div>
  );
};

export default CartTotal;
