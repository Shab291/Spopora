import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useState } from "react";
import { useShopContext } from "../context/ShopContext";
import axios from "axios";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const { backendUrl } = useShopContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      const response = await axios.post(
        backendUrl + "/api/newsletter/subscribe",
        {
          email: email,
        }
      );

      if (response.data.success) {
        setStatus("success");
        setMessage("Thank you for subscribing to our newsletter!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(
          response.data.message || "Subscription failed. Please try again."
        );
      }
    } catch (error) {
      setStatus("error");
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Network error. Please try again later.");
      }
    }
  };

  return (
    <section className="max-padding-container border-t-[1px] border-slate-200 py-12 mt-16">
      <div className="flexBetween flex-wrap gap-7 ">
        <div>
          <h4 className="bold-14 uppercase tracking-wider">
            Subscribe Newsletter
          </h4>
          <p>Get latest information on Event, Sales & Offers.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex p-1.5 bg-slate-100 ">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address for newsletter"
              className="p-1.5 w-[266px] bg-slate-100 outline-none"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              className="btn-dark !rounded-none !bg-[#FD0DAA] text-[13px]"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <div className="flex gap-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                "Subscribe"
              )}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`text-sm mt-2 sm:mt-0 sm:ml-3 flex items-center ${
                status === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status === "success" ? (
                <FaCheckCircle className="mr-2" />
              ) : (
                <FaExclamationTriangle className="mr-2" />
              )}
              {message}
            </div>
          )}
        </form>

        <div className="flex gap-x-3 pr-14">
          <div className="w-8 h-8 rounded-full hover:bg-[#FD0DAA] hover:text-white flexCenter transition-all duration-500">
            <FaFacebookF className="fa-icon" aria-label="Facebook" />
          </div>
          <div className="w-8 h-8 rounded-full hover:bg-[#FD0DAA] hover:text-white flexCenter transition-all duration-500">
            <FaInstagram className="fa-icon" aria-label="Instagram" />
          </div>
          <div className="w-8 h-8 rounded-full hover:bg-[#FD0DAA] hover:text-white flexCenter transition-all duration-500">
            <FaTelegram className="fa-icon" aria-label="Telegram" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
