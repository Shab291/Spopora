// components/ProductPreviewModal.jsx
import { useState, useEffect } from "react";
import { backend_url, currency } from "../App";
import axios from "axios";
import { FaTimes, FaStar, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductPreviewModal = ({ productId, isOpen, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("");

  useEffect(() => {
    if (isOpen && productId) {
      fetchProductDetails();
    }
  }, [isOpen, productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      // Use POST request since your backend expects POST
      const response = await axios.post(`${backend_url}/api/product/single`, {
        productId: productId,
      });

      if (response.data.success) {
        setProduct(response.data.product);
        // Set default selections
        if (
          response.data.product.colors &&
          response.data.product.colors.length > 0
        ) {
          setSelectedColor(response.data.product.colors[0]);
        }
        if (
          response.data.product.sizes &&
          response.data.product.sizes.length > 0
        ) {
          setSelectedSize(response.data.product.sizes[0]);
        }
        if (
          response.data.product.volumes &&
          response.data.product.volumes.length > 0
        ) {
          setSelectedVolume(response.data.product.volumes[0]);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">
            {loading ? "Loading..." : product?.name || "Product Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : product ? (
          <div className="p-6 grid md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.image[selectedImage]}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {product.image.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                      index === selectedImage
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              {/* Price and Rating */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-green-600">
                    {currency}
                    {product.price}
                  </span>
                  <div className="flex items-center">
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
                    <span className="ml-2 text-gray-600">
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-sm text-gray-500">
                  Category:{" "}
                  <span className="font-medium">{product.category}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span className="font-medium">
                    {product.popular ? "Popular Product" : "Regular Product"}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Added:{" "}
                  <span className="font-medium">
                    {new Date(product.date).toLocaleDateString()}
                  </span>
                </p>
              </div>

              {/* Attributes */}
              <div className="space-y-4 mb-6">
                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Available Colors:</h4>
                    <div className="flex gap-2 flex-wrap">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedColor(color)}
                          style={{ backgroundColor: color }}
                          className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer border-2 ${
                            selectedColor === color
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-300"
                          }`}
                          title={color}
                        >
                          {selectedColor === color && (
                            <FaCheck
                              style={{
                                color:
                                  color === "white" || color === "#FFFFFF"
                                    ? "black"
                                    : "white",
                              }}
                              size={12}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Available Sizes:</h4>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((size, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1 border rounded-md text-sm ${
                            selectedSize === size
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Volumes */}
                {product.volumes && product.volumes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Available Volumes:</h4>
                    <div className="flex gap-2 flex-wrap">
                      {product.volumes.map((volume, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedVolume(volume)}
                          className={`px-3 py-1 border rounded-md text-sm ${
                            selectedVolume === volume
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {volume}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Specifications */}
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Specifications:</h4>
                    <div className="grid gap-2 bg-gray-50 p-4 rounded-lg">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600 font-medium">
                              {key}:
                            </span>
                            <span className="text-gray-800">{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Selected Attributes Summary */}
              {(selectedColor || selectedSize || selectedVolume) && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold mb-2 text-blue-800">
                    Selected Options:
                  </h5>
                  <div className="text-sm text-blue-700">
                    {selectedColor && <p>Color: {selectedColor}</p>}
                    {selectedSize && <p>Size: {selectedSize}</p>}
                    {selectedVolume && <p>Volume: {selectedVolume}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">Product not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPreviewModal;
