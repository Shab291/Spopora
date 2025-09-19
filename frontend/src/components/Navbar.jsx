import { NavLink } from "react-router-dom";

const Navbar = ({ containerStyles, onClick }) => {
  const navLinks = [
    { path: "/", title: "Home" },
    { path: "/watch", title: "Wrist Watches" },
    { path: "/mens", title: "Men's Western Wear" },
    { path: "/headphone", title: "Headphones" },
    { path: "/perfume", title: "Perfumes" },
    { path: "/collection", title: "catalog" },
    { path: "/contact", title: "contact" },
  ];

  return (
    <nav className={`${containerStyles}`}>
      {navLinks.map((links) => (
        <NavLink
          key={links.title}
          to={links.path}
          className={({ isActive }) =>
            `${isActive ? "active-link" : ""} hover:text-gray-500`
          }
          onClick={onClick}
        >
          {links.title.toUpperCase()}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
