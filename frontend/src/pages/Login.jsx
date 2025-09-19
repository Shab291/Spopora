import { useState, useEffect } from "react";
import login from "../assets/login.png";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { useShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import ForgetPassword from "../components/ForgetPassword";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showForgetModal, setShowForgetModal] = useState(false);

  const { token, setToken, navigate, backendUrl, setUser } = useShopContext();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === "Sign Up") {
        //Sign Up Api
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);

          const userData = response.data.user;
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);

          toast.success("Account created successfully!");
        } else {
          toast.error(response.data.message);
        }
      } else {
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

          toast.success("Logged in successfully!");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //Toggle Password
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgetPassword = () => {
    setShowForgetModal(true);
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-50 to-white z-50">
      <div className="flex h-full">
        {/* IMAGE SIDE */}
        <div className="hidden sm:block w-1/2 bg-gray-100 ">
          <img
            src={login}
            alt="Login-Image"
            className="object-cover h-full w-full"
          />
        </div>
        {/* FORM SIDE - LOGIN/SIGNUP */}
        <div className="flex items-center justify-center w-full sm:w-1/2 p-4 sm:p-8">
          <form
            onSubmit={onSubmitHandler}
            className="w-full max-w-md space-y-6"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {currentState === "Login" ? "Welcome back" : "Create account"}
              </h3>

              <p className="mt-2 text-gray-600">
                {currentState === "Login"
                  ? "Sign in to your account"
                  : "Get started with your account"}
              </p>
            </div>

            {currentState === "Sign Up" && (
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            )}

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

            <div className="w-full">
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {currentState === "Login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  onClick={handleForgetPassword}
                >
                  Forget password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700   transition-colors shadow-md"
            >
              {currentState === "Sign Up" ? "Sign Up" : "Log In"}
            </button>

            <div className="text-center text-sm text-gray-600">
              {currentState === "Login" ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentState("Sign Up")}
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentState("Login")}
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
      {showForgetModal && (
        <ForgetPassword handleClose={() => setShowForgetModal(false)} />
      )}
    </div>
  );
};

export default Login;
