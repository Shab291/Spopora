import cards from "../assets/logos/cards.png";
import stripe from "../assets/logos/stripe.png";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const ServiceOptions = [
    { path: "/helpCenter", title: "Help center" },
    { path: "/paymentMethod", title: "Payment methods" },
    { path: "/contact", title: "Contact" },
    { path: "/orders", title: "Shipping status" },
    { path: "/contact", title: "Complaints" },
  ];

  const LegalOptions = [
    { path: "/privacyPolicy", title: "Privacy Policy" },
    { path: "/cookies", title: "Cookie settings" },
    { path: "/terms", title: "Terms & conditions" },
    { path: "/cancel", title: "Cancellation" },
    { path: "/imprint", title: "Imprint" },
  ];

  const OthersOptions = [
    { path: "/team", title: "Our teams" },
    { path: "/sustain", title: "Sustainability" },
    { path: "/press", title: "Press" },
    { path: "/jobs", title: "Jobs" },
    { path: "/newsletter", title: "Newsletter" },
  ];

  return (
    <footer className="mt-6">
      <div className="max-padding-container flex pt-8 border-t-[1px] border-slate-200 justify-between items-center flex-wrap gap-12">
        {/* logo */}
        <div className="flex flex-col max-w-sm gap-y-4">
          <h1 className="bold-28">Spopora</h1>
          <p>
            Browse our curated collection of timeless apparel and unique
            accessories. Discover the perfect pieces to define your style.
          </p>
          <div className="flex items-center gap-x-2">
            <img
              src={cards}
              width="160"
              height="44"
              alt="cards"
              className="mt-4"
            />
            <img
              src={stripe}
              width="100"
              height="14"
              alt="cards"
              className="mt-4"
            />
          </div>
        </div>

        <div className="flexStart gap-7 xl:gap-x-32 flex-wrap">
          <ul>
            <h4 className="h-4 mb-6 bold-18">Customer Service</h4>

            {ServiceOptions.map((item) => (
              <li key={item.title} className="my-2">
                <NavLink to={item.path} className="text-gray-500 regular-16">
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>

          <ul>
            <h4 className="h-4 mb-6 bold-18">Legal</h4>

            {LegalOptions.map((item) => (
              <li key={item.title} className="my-2">
                <NavLink to={item.path} className="text-gray-500 regular-16">
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>

          <ul>
            <h4 className="h-4 mb-6 bold-18">Legal</h4>

            {OthersOptions.map((item) => (
              <li key={item.title} className="my-2">
                <NavLink to={item.path} className="text-gray-500 regular-16">
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* copyrights */}
      <p className="flex justify-center gap-x-2 p-2 mt-4 text-center bg-[#495057] text-white">
        <span>{new Date().getFullYear()} Spopora</span>
        <span>All rights reserved.</span>
      </p>
    </footer>
  );
};

export default Footer;
