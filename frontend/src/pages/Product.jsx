import { useParams } from "react-router-dom";
import { useShopContext } from "../context/ShopContext";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { FaCheck, FaHeart, FaShoppingBag } from "react-icons/fa";
import ImageMagnifier from "../components/Magnifier";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { BsCash } from "react-icons/bs";
import { TbTruckReturn } from "react-icons/tb";
import ProductSpecs from "../components/ProductSpecs";
import RelatedProducts from "../components/RelatedProducts";
import Footer from "../components/Footer";
import ProductReview from "../components/ProductReview";

const Product = () => {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("");
  const [error, setError] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);

  const { productId } = useParams();
  const { products, currency, addToCart, getProductPrice } = useShopContext();

  // Helper function to get the current price based on selected volume
  const updateCurrentPrice = () => {
    if (!product) return;

    const price = getProductPrice(product, selectedVolume);
    setCurrentPrice(price);
  };

  const fetchProductData = async () => {
    try {
      if (!products || products.length === 0) return;

      const selectedProduct = products.find((item) => item._id === productId);
      if (selectedProduct) {
        setProduct(selectedProduct);
        setMainImage(selectedProduct.image[0]);
        // Set default selections if available
        if (selectedProduct.colors && selectedProduct.colors.length > 0) {
          setSelectedColor(selectedProduct.colors[0]);
        }
        if (selectedProduct.sizes && selectedProduct.sizes.length > 0) {
          setSelectedSize(selectedProduct.sizes[0]);
        }
        if (selectedProduct.volumes && selectedProduct.volumes.length > 0) {
          setSelectedVolume(selectedProduct.volumes[0]);
        }

        // Set initial price
        const initialPrice = getProductPrice(
          selectedProduct,
          selectedProduct.volumes?.[0] || ""
        );
        setCurrentPrice(initialPrice);
      } else {
        setError("Product not found");
      }
    } catch (error) {
      setError("Failed to load product");
      console.error("Product loading error:", error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Validate required selections
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    if (product.volumes && product.volumes.length > 0 && !selectedVolume) {
      alert("Please select a volume");
      return;
    }

    // Add to cart with all selected attributes
    addToCart(product._id, selectedColor, selectedSize, selectedVolume);
  };

  // Update price when volume changes
  useEffect(() => {
    updateCurrentPrice();
  }, [selectedVolume, product]);

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  if (!product) {
    return (
      <div className="no-product flex justify-center items-center h-64">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="no-product flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  // Check if this is a volume-based product category
  const volumeBasedCategories = ["liquids", "Perfumes", "cosmetics"];
  const isVolumeBasedProduct = volumeBasedCategories.includes(product.category);

  return (
    <>
      <div className="max-padding-container pt-16 bg-gradient-to-b from-gray-50 to-white">
        {/* PRODUCT DATA */}
        <div className="flex gap-8 lg:gap-18 flex-col lg:flex-row rounded-2xl p-3 mb-6 mt-8 lg:ml-10">
          {/* IMAGE */}
          <div className="flex gap-x-3 max-w-[550px] xs:max-[477px]">
            <div className="flex-1 flexCenter flex-col gap-[7px] flex-wrap">
              {product.image.map((item, i) => (
                <img
                  src={item}
                  alt="ProductImage"
                  key={i}
                  onClick={() => setMainImage(item)}
                  className={`object-cover aspect-square rounded-lg cursor-pointer w-16 h-16 ${
                    item === mainImage
                      ? "border-2 border-slate-900"
                      : "border border-slate-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex-[4] mt-3 flex rounded-xl">
              <ImageMagnifier src={mainImage} alt={product.name} />
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="rounded-2xl px-5 py-3 flex-1">
            <h2 className="leading-none h2">{product.name}</h2>

            {/* RATING & PRICE */}
            <div className="flex items-baseline gap-x-5 mt-2">
              <div className="flex items-center gap-x-2 text-slate-900">
                <div className="flex gap-x-2 text-slate-900">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={
                        star <= Math.round(product.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                      size={16}
                    />
                  ))}
                </div>
                <span className="text-gray-600 medium-16">
                  {product.rating ? product.rating.toFixed(1) : "0.0"} (
                  {product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <h4 className="bold-20 my-2 text-[#FD0DAA]">
              {currency}
              {currentPrice.toFixed(2)}
              {isVolumeBasedProduct && selectedVolume && (
                <span className="text-sm text-gray-500 ml-2 font-normal">
                  for {selectedVolume}
                </span>
              )}
            </h4>

            {isVolumeBasedProduct &&
              product.volumes &&
              product.volumes.length > 0 && (
                <div className="text-sm text-gray-600 mb-2">
                  {!selectedVolume ? "Select a volume to see price" : ""}
                </div>
              )}

            <p className="max-w-[555px] text-slate-700 mb-6">
              {product.description}
            </p>

            {/* COLOR SELECTOR */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Color:</h4>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      style={{ background: color }}
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                        color === selectedColor
                          ? "border-slate-900 ring-2 ring-slate-200"
                          : "border-slate-300"
                      }`}
                      aria-label={`${color} color`}
                    >
                      {color === selectedColor && (
                        <FaCheck
                          style={{
                            color:
                              color === "white" || color === "#FFFFFF"
                                ? "black"
                                : "white",
                          }}
                          size={14}
                        />
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-slate-600 mt-2">
                    Selected:{" "}
                    <span className="font-medium">{selectedColor}</span>
                  </p>
                )}
              </div>
            )}

            {/* SIZE SELECTOR */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Size:</h4>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md ${
                        size === selectedSize
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="text-sm text-slate-600 mt-2">
                    Selected:{" "}
                    <span className="font-medium">{selectedSize}</span>
                  </p>
                )}
              </div>
            )}

            {/* VOLUME SELECTOR */}
            {product.volumes && product.volumes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Volume:</h4>
                <div className="flex gap-2 flex-wrap">
                  {product.volumes.map((volume, i) => {
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedVolume(volume)}
                        className={`px-4 py-2 border rounded-md flex flex-col items-center ${
                          volume === selectedVolume
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
                        }`}
                      >
                        <span className="bold-16">{volume}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedVolume && (
                  <p className="text-sm text-slate-600 mt-2">
                    Selected:{" "}
                    <span className="font-medium">{selectedVolume}</span>
                  </p>
                )}
              </div>
            )}

            {/* ADD TO CART BUTTON */}
            <div className="flex gap-x-3 pt-6">
              <button
                className="btn-dark !rounded-lg sm:w-1/2 flexCenter gap-x-2 capitalize py-3 text-lg"
                onClick={handleAddToCart}
                disabled={
                  isVolumeBasedProduct &&
                  product.volumes &&
                  product.volumes.length > 0 &&
                  !selectedVolume
                }
              >
                Add To Cart <FaShoppingBag />
              </button>
              <button className="btn-outline !rounded-lg !py-3.5 text-lg">
                <FaHeart />
              </button>
            </div>

            {/* PRODUCT FEATURES */}
            <div className="pt-8 flex flex-col gap-y-3">
              <div className="flex items-center gap-x-2 text-red-700">
                <FaTruckFast />
                <span className="bg-amber-100 px-3 py-1.5 rounded font-medium">
                  Free delivery on orders over $100.
                </span>
              </div>
              <div className="flex items-center gap-x-2 text-slate-700">
                <VscWorkspaceTrusted />
                <p className="text-sm">Authenticity You Can Trust</p>
              </div>
              <div className="flex items-center gap-x-2 text-slate-700">
                <BsCash />
                <p className="text-sm">
                  Enjoy Cash on Delivery for Your Convenience
                </p>
              </div>
              <div className="flex items-center gap-x-2 text-slate-700">
                <TbTruckReturn />
                <p className="text-sm">
                  Easy Return and Exchanges within 7 days
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProductReview productId={productId} />
        <ProductSpecs product={product} />
        <RelatedProducts
          category={product.category}
          currentProductId={productId}
        />
      </div>
      <Footer />
    </>
  );
};

export default Product;
