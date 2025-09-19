import { useState, useEffect } from "react";
import { currency } from "../App";
import {
  TbTrash,
  TbEdit,
  TbEye,
  TbChevronLeft,
  TbChevronRight,
} from "react-icons/tb";
import { useAdminContext } from "../context/adminContext";
import { useProductContext } from "../context/productContext";
import ProductPreviewModal from "../components/ProductPreviewModal";
import ProductEditModal from "../components/ProductEditModal";

const List = () => {
  const { token } = useAdminContext();

  const {
    allProducts,
    loading,
    selectedCategory,
    setSelectedCategory,
    fetchAllProducts,
    handleRemove,
    handleProductUpdated,
    removing,
  } = useProductContext();

  const [displayedProducts, setDisplayedProducts] = useState([]); // Products to display

  const [sortBy, setSortBy] = useState("newest");

  // For Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewProductId, setPreviewProductId] = useState(null);
  // For Removing Product
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // For Edit Modal
  const [isEditOpen, setIsEditOpen] = useState(false); // Changed from true to false
  const [editProductId, setEditProductId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // All available categories
  const allCategories = [
    "all",
    "Headphones",
    "Mens Wear",
    "Women Wear",
    "Perfumes",
    "cosmetics",
    "Speakers",
    "Ladies Bags",
    "Watches",
    "Electronics",
    "liquids",
    "accessories",
  ];

  // Apply filtering, sorting and pagination on the frontend
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by category (if needed)
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        );
        break;
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => {
          // First by popularity flag, then by rating
          if (a.popular !== b.popular) return b.popular ? 1 : -1;
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default to newest
        filtered.sort(
          (a, b) =>
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        );
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    setDisplayedProducts(paginated);
  }, [allProducts, selectedCategory, sortBy, currentPage, itemsPerPage]);

  const handleViewProduct = (productId) => {
    setPreviewProductId(productId);
    setIsPreviewOpen(true);
  };

  const handleEditProduct = (productId) => {
    setEditProductId(productId);
    setIsEditOpen(true);
  };

  // Pagination functions
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  //const totalFilteredProducts = allProducts.length;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);

      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed after first page
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed before last page
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always include last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="px-2 sm:px-8 mt-2">
        <h3 className="bold-28 mb-4">All Product List</h3>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-8 mt-2">
      <h3 className="bold-28 mb-4">All Product List</h3>

      {/* FILTERS, SORTING AND PAGINATION CONTROLS */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); // Reset to first page when changing category
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category === "all"
                  ? "All Categories"
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1); // Reset to first page when changing sort
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Popular First</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Items per Page
          </label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={fetchAllProducts}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
        {/* TABLE HEADER */}
        <div className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_120px] items-center py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b">
          <div>Image</div>
          <div>Name & Details</div>
          <div>Category</div>
          <div>Price</div>
          <div>Attributes</div>
          <div className="text-center">Actions</div>
        </div>

        {/* PRODUCT LIST */}
        <div className="divide-y divide-gray-100">
          {displayedProducts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">No products found.</p>
              {selectedCategory !== "all" && (
                <p className="text-sm text-gray-400 mt-1">
                  Try changing your filters or adding new products.
                </p>
              )}
            </div>
          ) : (
            displayedProducts.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_120px] items-center py-3 px-4 hover:bg-gray-50 transition-colors"
              >
                {/* IMAGE */}
                <div>
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                </div>

                {/* NAME & DESCRIPTION */}
                <div>
                  <h4 className="font-semibold text-gray-800 line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.popular ? "Popular" : "Regular"}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-2">
                      ★ {item.rating || 0.0}
                    </span>
                  </div>
                </div>

                {/* CATEGORY */}
                <div>
                  <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>

                {/* PRICE */}
                <div>
                  <span className="font-semibold text-green-700">
                    {currency}
                    {item.price}
                  </span>
                </div>

                {/* ATTRIBUTES */}
                <div>
                  <div className="flex flex-wrap gap-1">
                    {item.colors && item.colors.length > 0 && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {item.colors.length} color(s)
                      </span>
                    )}
                    {item.sizes && item.sizes.length > 0 && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {item.sizes.length} size(s)
                      </span>
                    )}
                    {item.volumes && item.volumes.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {item.volumes.length} volume(s)
                      </span>
                    )}
                    {(!item.colors || item.colors.length === 0) &&
                      (!item.sizes || item.sizes.length === 0) &&
                      (!item.volumes || item.volumes.length === 0) && (
                        <span className="text-xs text-gray-400">
                          No attributes
                        </span>
                      )}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleViewProduct(item._id)}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                    title="View Product"
                  >
                    <TbEye size={18} />
                  </button>
                  <button
                    onClick={() => handleEditProduct(item._id)}
                    className="p-2 text-green-500 hover:bg-green-100 rounded-full transition-colors"
                    title="Edit Product"
                  >
                    <TbEdit size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedId(item._id);
                      setShowConfirm(true);
                    }}
                    disabled={removing}
                    className={`p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors ${
                      removing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Delete Product"
                  >
                    <TbTrash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PAGINATION */}
      {displayedProducts.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, allProducts.length)} of{" "}
            {allProducts.length} products
          </div>

          <div className="flex items-center gap-2">
            {/* Previous button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TbChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 flex items-center justify-center border rounded-md text-sm ${
                    currentPage === page
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TbChevronRight size={16} />
            </button>
          </div>

          {/* Page jump (optional) */}
          <div className="flex items-center gap-2 text-sm">
            <span>Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (!isNaN(page)) {
                  goToPage(Math.max(1, Math.min(page, totalPages)));
                }
              }}
              className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
            />
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRemove(selectedId);
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT PREVIEW MODAL */}
      <ProductPreviewModal
        productId={previewProductId}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewProductId(null);
        }}
      />

      {/* PRODUCT EDIT MODAL */}
      {isEditOpen && (
        <ProductEditModal
          productId={editProductId}
          token={token}
          onClose={() => {
            setIsEditOpen(false);
            setEditProductId(null);
          }}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
};

export default List;
