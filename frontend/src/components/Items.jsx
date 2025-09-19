import { Link } from "react-router-dom";
import FormatPrice from "./FormatPrice";
import { useState } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { useShopContext } from "../context/ShopContext";

const Items = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useShopContext();

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#f5f5f5] p-2 mt-1 mb-2 relative overflow-hidden transition-all duration-300 rounded-lg shadow-md"
    >
      <Link
        to={`/product/${product._id}`}
        className="flexCenter p-2 bg-[#f5f5f5} overflow-hidden relative"
      >
        <div className="relative">
          <img
            src={product.image[0]}
            alt="ProductImage"
            loading="lazy"
            className={`transition-all duration-300  border-1 border-slate-200 ${
              isHovered ? "hover:scale-110" : "hover:scale-100"
            }`}
          />

          {isHovered && (
            <div>
              <button
                className="absolute bottom-1 right-1 py-a px-2 flex items-center gap-1 rounded-full bg-[#FD0DAA] hover:bg-[#ba107c] text-white"
                onClick={() => addToCart(product._id)}
              >
                Add <TiShoppingCart />
              </button>
            </div>
          )}
        </div>
      </Link>
      {/* Info */}
      <div className="p-3">
        <h4 className="bold-18 line-clamp-1 !py-0">{product.name}</h4>
        <div className="flexBetween pt-1">
          <p className="h5 text-[#FD0DAA]">{product.category}</p>
          <h5 className="h5 pr-2 text-[#FD0DAA]">
            <FormatPrice price={product.price} />
          </h5>
        </div>
        <p className="line-clamp-2 py-1">{product.description}</p>
      </div>
    </div>
  );
};

export default Items;
