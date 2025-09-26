import { useState, useEffect, useRef, useMemo } from "react";
import { useShopContext } from "../context/ShopContext";
import mensBg from "../assets/mensBg.png";
import Items from "../components/Items";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

const MenWear = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { products } = useShopContext();
  const headingRef = useRef(null);
  const itemsPerPage = 10;

  // Filter the Product According to the Category
  const filteredProducts = useMemo(() => {
    return products.filter((item) => item.category === "Mens Wear");
  }, [products]);

  const paginatedProduct = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    // Use setTimeout to ensure the DOM has rendered before triggering animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="main-container bg-gradient-to-b from-gray-50 to-white">
        {/* Top Background */}
        <div className=" top-0 relative w-full h-[450px] overflow-hidden">
          <img src={mensBg} alt="watch background" className="w-full h-full" />
          <div className="absolute inset-0 flex items-end bg-black/20">
            <h1
              ref={headingRef}
              className={`text-white uppercase font-bold bold-52 md:text-5xl lg:text-6xl text-center p-4 transition-all duration-1000 ease-out ${
                isVisible
                  ? "opacity-100 transform translate-x-0"
                  : "opacity-0 transform -translate-x-20"
              }`}
              style={{
                textShadow:
                  "2px 2px 4px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 255, 255, 0.4)",
              }}
            >
              Mens Wear Collection
            </h1>
          </div>
        </div>

        {/* Products Items */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No headphones found.</p>
          </div>
        ) : (
          <div className="max-padding-container pt-6">
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {paginatedProduct.map((product, index) => (
                <div key={index} className="grid-item">
                  <Items product={product} />
                </div>
              ))}
            </div>

            {/* Pagination - Only show when there are products AND multiple pages */}
            {filteredProducts.length > itemsPerPage && (
              <Pagination
                totalItems={filteredProducts.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                className="mt-14 mb-10"
              />
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MenWear;
