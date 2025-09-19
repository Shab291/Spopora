import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useShopContext } from "../context/ShopContext";
import { TbArrowBackUp, TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentFill } from "react-icons/ri";
import DOMPurify from "dompurify";

const ProductSpecs = () => {
  const { products } = useShopContext();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  const { productId } = useParams();

  const fetchProductData = async () => {
    try {
      if (!products || products.length === 0) return;

      const selectedProduct = products.find((item) => item._id === productId);

      if (selectedProduct) {
        setProduct(selectedProduct);
      }
    } catch (error) {
      setError("Failed to load product");
      console.error("Product loading error:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specs", label: "Specifications" },
  ];

  const tabContent = {
    description: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Product Summery</h3>
        <p className="text-gray-700">
          {product?.description ||
            "Our premium product is crafted with meticulous attention to detail using only the finest materials. Designed for both style and comfort, it features innovative construction that ensures lasting quality."}
        </p>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Complete Details & Benefits
          </h4>

          {product?.details ? (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.details),
              }}
            />
          ) : (
            <p className="text-gray-500">No details available.</p>
          )}
        </div>
      </div>
    ),
    specs: (
      <>
        {/* PRODUCT SPECIFICATIONS */}
        {product?.specifications &&
          Object.keys(product?.specifications).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-6 ">Specifications</h3>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="grid md:grid-cols-1 gap-6">
                  {Object.entries(product?.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex max-w-[400px] justify-between items-center py-2 border-b border-gray-100"
                      >
                        <span className="font-semibold text-slate-700">
                          {key}:
                        </span>
                        <span className="text-slate-600">{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
      </>
    ),
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h3 className="bold-32 mb-2">Product Details</h3>
      <div className="space-y-8">
        {/* Tabbed Content */}
        <div className="bg-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 border-t-2 border-primary-500"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="bg-white p-6 rounded-b-xl">
            {tabContent[activeTab]}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-50 rounded-full">
                <TbArrowBackUp className="text-orange-500 text-2xl" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Easy Returns
                </h4>
                <p className="text-gray-600">
                  Not satisfied? No problem. We offer a 30-day hassle-free
                  return policy with prepaid return labels for your convenience.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-red-50 rounded-full">
                <TbTruckDelivery className="text-red-500 text-2xl" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Fast Delivery
                </h4>
                <p className="text-gray-600">
                  Receive your order within 2-3 business days with our expedited
                  shipping options. Track your package in real-time.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <RiSecurePaymentFill className="text-blue-500 text-2xl" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Secure Payment
                </h4>
                <p className="text-gray-600">
                  Your security is our priority. All transactions are encrypted
                  with industry-standard SSL technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSpecs;
