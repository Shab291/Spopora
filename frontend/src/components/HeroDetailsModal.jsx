import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useShopContext } from "../context/ShopContext";

const HeroDetailsModal = ({ handleClose, product, onNext, onPrev }) => {
  const { addToCart, currency } = useShopContext();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product._id);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 max-h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-white/10 border-b border-white/20">
          <h2 className="text-base sm:text-lg md:text-xl uppercase text-white font-semibold tracking-wide">
            Item Details
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="rounded-full p-1 hover:bg-white/20 hover:rotate-180 transition-all duration-300"
          >
            <IoClose size={24} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-10 p-4 sm:p-6 md:p-8 text-white">
          {/* Description */}
          <div className="flex-1 w-full text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              {product.name}
            </h1>
            <p className="text-[#FD0DAA] text-sm sm:text-base md:text-lg font-semibold mb-3">
              {product.category}
            </p>
            <p className="text-sm sm:text-base leading-relaxed line-clamp-3 md:line-clamp-none mb-4">
              {product.description}
            </p>
            <p className="text-base sm:text-lg md:text-xl font-semibold mb-5">
              Price: {currency}
              {product.price}
            </p>

            <button
              onClick={handleAddToCart}
              className="w-full sm:w-[220px] bg-white text-slate-900 px-6 py-2.5 rounded-full hover:bg-[#bc107d] hover:text-white transition-all duration-300 uppercase tracking-wide shadow-lg"
            >
              Add to Cart
            </button>
          </div>

          {/* Product Image */}
          <div className="flex justify-center items-center w-full md:w-[45%] max-w-[380px]">
            <img
              src={
                product.image && product.image.length > 0
                  ? product.image[0]
                  : "/placeholder-image.jpg"
              }
              alt={product.name}
              className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-contain rounded-xl border border-white/10"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 p-4 sm:p-5 bg-white/5 border-t border-white/20">
          <button
            onClick={onPrev}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 text-black hover:bg-[#ba107c] hover:text-white transition-all duration-300"
          >
            <IoChevronBack size={18} /> Prev
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 text-black hover:bg-[#ba107c] hover:text-white transition-all duration-300"
          >
            Next <IoChevronForward size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroDetailsModal;
