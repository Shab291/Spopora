import { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const ForgetPassword = ({ handleClose }) => {
  const [currentState, setCurrentState] = useState("FirstStep"); // FirstStep-email, SecondStep-OTP, ThirdStep-New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const { backendUrl } = useShopContext();

  //Create Send OTP General Function for re-use
  const handleEmailSubmitGeneral = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/forgotPassword",
        { email }
      );

      if (response.data.success) {
        toast.success("OTP sent to your email");
        setTimer(60);
        setIsResendDisabled(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Error sending OTP");
    }
  };

  //First Call of Api to send OTP by Email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await handleEmailSubmitGeneral(); //re-used here
    setCurrentState("SecondStep");
    setLoading(false);
  };

  //Second Call of APi to resend OTP again
  const handleResend = async () => {
    if (!email) {
      toast.error("Email is required to resend OTP");
      return;
    }

    if (!isResendDisabled) {
      await handleEmailSubmitGeneral();

      // Restart timer
      setTimer(60);
      setIsResendDisabled(true);
    }
  };

  //Calling Api for Submit Verify & submit OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpCode = otp.join("");

    try {
      //Calling the API
      const response = await axios.post(backendUrl + "/api/user/verifyOtp", {
        email,
        otp: otpCode,
      });

      if (response.data.success) {
        toast.success("OTP verified successfully");
        setCurrentState("ThirdStep");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  //Calling Api for submit new password
  const handleNewPassSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    const otpCode = otp.join("");
    console.log("OTP submitted:", otpCode);

    try {
      //Calling the API
      const response = await axios.post(
        backendUrl + "/api/user/resetPassword",
        { email, otp: otpCode, newPassword }
      );

      if (response.data.success) {
        toast.success("Password reset successfully");
        handleClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  //OTP fields setting
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (index < 3) inputRefs[index + 1].current.focus();
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  //BackSpace remove previous digit function
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  //OTP Re-Send Functionality with interval
  useEffect(() => {
    let interval;

    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  return (
    <>
      <div className="fixed inset-0 p-4 bg-black/70 z-50 flex items-center justify-center">
        <div className="relative bg-white rounded-xl mx-auto shadow-2xl w-full max-w-md overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <h3 className="text-xl font-semibold">
              {currentState === "FirstStep" && "Forgot Password"}
              {currentState === "SecondStep" && "Verify OTP"}
              {currentState === "ThirdStep" && "Reset Password"}
            </h3>
            <button
              className="p-2 rounded-full hover:bg-indigo-600 transition-colors cursor-pointer"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>

          {/* First Step Email Address */}
          <div className="p-6">
            {currentState === "FirstStep" && (
              <form onSubmit={handleEmailSubmit}>
                <p className="text-gray-600 mb-6 text-center">
                  For password recovery please enter your registered email
                  address.
                </p>
                <div className="w-full mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Second Step OTP Verification */}
            {currentState === "SecondStep" && (
              <form onSubmit={handleOtpSubmit}>
                <p className="text-gray-600 mb-6 text-center">
                  {`We've sent a 4-digit OTP to your email "${email}". Please check your inbox and enter the code below.`}
                </p>
                <div className="w-full mb-4">
                  <label
                    htmlFor="text"
                    className="block text-sm text-center font-medium text-gray-700 mb-4"
                  >
                    OTP Code
                  </label>

                  <div className="flex items-center justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        pattern="[0-9]"
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={inputRefs[index]}
                        className="w-16 h-16 text-2xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Verify
                  </button>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResendDisabled}
                    className={`text-sm cursor-pointer ${
                      isResendDisabled
                        ? "text-gray-400"
                        : "text-blue-600 hover:text-blue-800"
                    } transition-colors`}
                  >
                    {isResendDisabled
                      ? `Resend OTP in ${timer}s`
                      : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}

            {/* Third Step New Password */}
            {currentState === "ThirdStep" && (
              <form onSubmit={handleNewPassSubmit}>
                <p className="text-green-600 mb-6 text-center font-medium">
                  OTP confirmed. Please enter a new password.
                </p>
                <div className="w-full mb-4">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>

                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="w-full mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
