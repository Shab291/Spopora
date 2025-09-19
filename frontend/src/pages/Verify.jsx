import { useEffect, useState } from "react";
import { useShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const { navigate, token, setCartItem, backendUrl } = useShopContext();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!token) {
        toast.error("Authentication required");
        navigate("/login");
        return;
      }

      if (!success || !orderId) {
        toast.error("Invalid payment verification URL");
        navigate("/cart");
        return;
      }

      try {
        const { data } = await axios.post(
          `${backendUrl}/api/order/verifyStripe`,
          { success, orderId },
          { headers: { token } }
        );

        if (data.success) {
          toast.success("Payment verified successfully!");
          setCartItem({});
          navigate("/orders");
        } else {
          toast.error("Payment verification failed");
          navigate("/cart");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong during verification");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [token, success, orderId, backendUrl, navigate, setCartItem]);

  return (
    <div className="flexCenter min-h-[50vh] text-lg text-gray-600">
      {loading ? "Verifying payment, please wait..." : "Redirecting..."}
    </div>
  );
};

export default Verify;
