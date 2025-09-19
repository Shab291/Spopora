import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaSquarePlus, FaBars } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";

const SideBar = ({ admin }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Array of navigation items for cleaner code
  const navItems = [
    { path: "/", icon: <MdSpaceDashboard />, label: "DashBoard" },
    { path: "/add", icon: <FaSquarePlus />, label: "Add" },
    { path: "/list", icon: <FaSquarePlus />, label: "List" },
    { path: "/orders", icon: <FaSquarePlus />, label: "Orders" },
    { path: "/emailCamp", icon: <FaSquarePlus />, label: "Campaigns" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full sm:w-1/5 sm:h-screen bg-white shadow-sm z-10">
      <div className="flex flex-col gap-y-6 p-4 sm:pt-14">
        {/* LOGO + MENU BUTTON */}
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="bold-22 xl:bold-32 sm:pl-2 lg:pl-12 hover:text-primary-500 transition-colors"
          >
            Spopora-Admin
          </Link>
          <button
            className="sm:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Admin Info Section */}
        <div className="p-4 border-b hidden sm:block">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {admin?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="font-semibold text-sm">{admin?.name || "Admin"}</p>
              <p className="text-xs text-gray-600">
                {admin?.email || "admin@spopora.com"}
              </p>
              <p className="text-xs text-blue-600 capitalize">
                {admin?.role || "admin"}
              </p>
            </div>
          </div>
        </div>

        {/* LINKS */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } flex-col gap-y-8 sm:flex sm:pt-10`}
        >
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setMenuOpen(false)} // close on link click (mobile)
              className={({ isActive }) =>
                `flex items-center gap-x-2 text-nowrap sm:pl-12 p-5 medium-15 cursor-pointer h-10 hover:bg-gray-100 transition-colors ${
                  isActive ? "activeLink" : ""
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
