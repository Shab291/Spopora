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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex pt-6 place-content-center px-2 z-50">
      <div className="relative mx-auto w-full h-[95vh] lg:w-[1000px] lg:h-[95vh] rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl border border-white/30 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/10 rounded-t-2xl border-b border-white/20 backdrop-blur-md">
          <h2 className="text-lg uppercase text-white font-semibold">
            Item Details
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 hover:bg-white/20 hover:rotate-180 transition-all duration-300"
          >
            <IoClose size={24} className="text-white" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row justify-center p-6 text-white flex-1">
            {/* Description Side */}
            <div className="px-4 lg:px-6 flex flex-col justify-between">
              <div>
                <h1 className="bold-36">{product.name}</h1>
                <p className="text-[#FD0DAA] bold-18">{product.category}</p>
                <p className="mt-3 line-clamp-2 lg:line-clamp-none">
                  {product.description}
                </p>
                <p className="mt-3 bold-20">
                  Price: {currency}
                  {product.price}
                </p>
              </div>

              <button
                onClick={handleAddToCart}
                className="bold-16 mt-6 bg-white text-slate-900 px-6 py-2 w-[200px] rounded-full hover:bg-[#bc107d] hover:text-white transition-all duration-300 font-medium uppercase cursor-pointer"
                style={{
                  boxShadow: "2px 2px 10px rgba(255, 255, 255, 0.5)",
                }}
              >
                Add to Cart
              </button>
            </div>

            {/* Image Side */}
            <div className="min-w-[300px] md:min-w-[400px] lg:min-w-[350px] min-h-[300px] md:min-h-[400px] lg:min-h-[350px] flex items-center justify-center p-4">
              <img
                src={
                  product.image && product.image.length > 0
                    ? product.image[0]
                    : "/placeholder-image.jpg"
                }
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Navigation - Now properly contained */}
          <div className="flex gap-4 justify-center p-4 bg-white/5 mt-auto border-t border-white/20">
            <button
              onClick={onPrev}
              className="flex items-center gap-2 bg-white/90 text-black px-6 py-2 rounded-full hover:bg-[#ba107c] hover:text-white transition-all duration-300"
            >
              <IoChevronBack size={18} /> Prev
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-2 bg-white/90 text-black px-6 py-2 rounded-full hover:bg-[#ba107c] hover:text-white transition-all duration-300"
            >
              Next <IoChevronForward size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDetailsModal;
