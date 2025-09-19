import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import logoWhite from "../assets/logos/logo-white.png";
import { FaBars } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { TbUserCircle } from "react-icons/tb";
import { RiUserLine } from "react-icons/ri";
import { FaBarsStaggered } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import { useShopContext } from "../context/ShopContext";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [profileMenuOpened, setProfileMenuOpened] = useState(false);
  const {
    getCartCount,
    navigate,
    token,
    setToken,
    user,
    setUser,
    setCartItem,
  } = useShopContext();
  const profileRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpened(!menuOpened);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpened(!profileMenuOpened);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCartItem({});
    navigate("/");
    setProfileMenuOpened(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpened(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full margin-auto mb-2 fixed top-0 pl-6 pr-6 z-50 bg-white border-b-1 border-gray-400">
      <div className="flexBetween py-2 relative">
        {/* LOGO */}
        <Link to="/" className="flex flex-1 gap-2 items-center">
          <img src={logoWhite} alt="logo" className="w-[185px] h-[55px]" />
        </Link>

        {/* NAVBAR */}
        <div className="flex flex-1">
          <Navbar
            containerStyles={`${
              menuOpened
                ? "flex items-start flex-col gap-y-8 fixed top-16 right-6 p-5 bg-white rounded-xl shadow-md w-52 ring-1 ring-slate-900/5 z-50"
                : "hidden xl:flex gap-x-4 lg:gap-x-4 medium-16 text-slate-900 p-1 text-nowrap tracking-2"
            }`}
            onClick={() => setMenuOpened(false)}
          />
        </div>

        {/* BUTTON */}
        <div className="flex flex-1 items-center justify-end gap-x-4 xl:gap-x-8 text-[#FD0DAA]">
          {/* Menu-Toggle */}
          {menuOpened ? (
            <FaBarsStaggered
              onClick={toggleMenu}
              className="xl:hidden cursor-pointer text-xl"
            />
          ) : (
            <FaBars
              onClick={toggleMenu}
              className="xl:hidden cursor-pointer text-xl"
            />
          )}

          {/* Cart */}
          <Link to={"/cart"} className="flex relative">
            <div className="ring-1 ring-[#bc127e] shadow-lg text-white bg-[#FD0DAA] hover:bg-[#bc127e] rounded-full p-1 bold-18">
              <TiShoppingCart size={22} />
              <span className="bg-slate-900 text-white text-[12px] font-semibold absolute -top-3.5 -right-2 flexCenter w-4 h-4 rounded-full shadow-md">
                {getCartCount()}
              </span>
            </div>
          </Link>

          {/* UserProfile */}
          <div className="relative text-slate-900" ref={profileRef}>
            <div>
              {token ? (
                <div className="lg:flex lg:items-center gap-x-1">
                  {user && user.name && (
                    <div className="hidden lg:flex">{user.name}</div>
                  )}
                  <TbUserCircle
                    size="30"
                    className="cursor-pointer text-[#FD0DAA] hover:text-[#bc127e]"
                    onClick={toggleProfileMenu}
                  />
                </div>
              ) : (
                <button
                  className="flex btn-dark !bg-[#FD0DAA] !ring-[#bc127e] hover:!bg-[#bc127e] justify-center items-center gap-x-2"
                  onClick={() => navigate("/login")}
                >
                  Login <RiUserLine size="18" className="cursor-pointer" />
                </button>
              )}
            </div>

            {/* DROPDOWN */}
            {token && (
              <ul
                className={`bg-white p-2 w-32 ring-1 ring-slate-300 rounded absolute right-0 top-7 flex flex-col regular-14 shadow-md z-50 transition-all duration-300 ${
                  profileMenuOpened
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <li
                  onClick={() => {
                    navigate("/orders");
                    setProfileMenuOpened(false);
                  }}
                  className="p-2 text-slate-800 hover:bg-gray-100 medium-16 rounded-md cursor-pointer"
                >
                  Orders
                </li>
                <li
                  onClick={logout}
                  className="p-2 text-slate-800 hover:bg-gray-100 medium-16 rounded-md cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
