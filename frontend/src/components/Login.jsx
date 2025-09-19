import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { useShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { token, setToken, backendUrl, setUser, navigate } = useShopContext();

  const handleClose = () => {
    setIsOpen(false);
  };

  //Toggle Password
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (token) {
        toast("Already Logged in ");
        return;
      }

      //Login Api
      const response = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        // Store user data (including name)
        const userData = response.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // close the login modal
        setIsOpen(false);

        toast.success("Logged in successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 p-4 bg-black/70 z-20">
          <div className="relative rounded-lg mx-auto my-30 bg-white shadow-2xl w-full max-w-2xl overflow-hidden max-h-[50vh]">
            <div className="flex justify-between items-center p-2 bg-indigo-50">
              <h3 className="bold-20">Login</h3>
              <button
                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                onClick={handleClose}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>

            {/* Input Form */}

            <div className="flex flex-col gap-y-3 pt-6 p-6">
              <form onSubmit={onSubmitHandler}>
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
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

                <div className="w-full pt-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter a password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength="8"
                      autoComplete="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-12"
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={togglePassword}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 pb-2">
                  <button
                    type="submit"
                    className=" w-full px-4 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700   transition-colors shadow-md"
                  >
                    Login
                  </button>
                </div>
              </form>

              <p className="text-center">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
