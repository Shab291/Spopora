import { useState } from "react";
import loginPic from "../assets/loginImg.png";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { useAdminContext } from "../context/adminContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, loading: contextLoading, navigate } = useAdminContext();

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      await login(email, password);
    } catch (error) {
      console.error("Login form error:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white z-50">
      {/* CONTAINER */}
      <div className="flex h-full w-full">
        {/* IMAGE SIDE */}
        <div className="w-1/2 hidden sm:block bg-gray-50">
          <img
            src={loginPic}
            alt="Login-Image"
            className="object-cover h-full w-full"
          />
        </div>

        {/* FORM SIDE */}
        <div className=" flex justify-center items-center w-full md:w-1/2 p-4 sm:p-8">
          <form
            className="w-full max-w-md space-y-6"
            onSubmit={onSubmitHandler}
          >
            <div>
              <h2 className="bold-28 mb-5 uppercase">Spopora Admin Pannel</h2>
              <h3 className="bold-20">Login </h3>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Enter Email"
                id="email"
                name="email"
                autoComplete="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  id="password"
                  name="password"
                  autoComplete="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={togglePassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              onClick={() => navigate("/")}
              disabled={loading || contextLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
            >
              {loading || contextLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
