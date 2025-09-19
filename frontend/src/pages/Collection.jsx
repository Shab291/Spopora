import Search from "../components/Search";
import { useShopContext } from "../context/ShopContext";
import { useEffect, useState } from "react";
import Items from "../components/Items";
import Title from "../components/Title";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

const Collection = () => {
  const { products, search } = useShopContext();
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [filterProducts, setFilterProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const categories = [
    "Headphones",
    "Mens Wear",
    "Women Wear",
    "Cosmetics",
    "Perfumes",
    "Speakers",
    "Ladies Bags",
    "Watches",
    "Electronics",
    "accessories",
  ];

  const sortOptions = [
    { value: "relevant", label: "Most Relevant" },
    { value: "low", label: "Price: Low to High" },
    { value: "high", label: "Price: High to Low" },
    { value: "newest", label: "Newest Arrivals" },
  ];

  const toggleCategory = (cat) => {
    setCategory((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  };

  const applyFilter = () => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length) {
      filtered = filtered.filter((product) =>
        category.includes(product.category)
      );
    }

    return filtered;
  };

  const applySort = (productList) => {
    const sorted = [...productList]; // Create copy
    switch (sortType) {
      case "low":
        return sorted.sort((a, b) => a.price - b.price);
      case "high":
        return sorted.sort((a, b) => b.price - a.price);
      case "newest":
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return sorted;
    }
  };

  useEffect(() => {
    let filtered = applyFilter();
    let sorted = applySort(filtered);
    setFilterProducts(sorted);
    setCurrentPage(1);
  }, [category, sortType, products, search]);

  const getPaginatedProducts = () => {
    if (!filterProducts.length) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filterProducts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row gap-x-12 ml-10 mr-10 mt-20 pt-12">
          <div className="gap-8 mb-16">
            {/* Filter Options */}
            <div className="min-w-72 bg-slate-100 p-4 mt-8 pl-6 lg:pl-10 rounded-xl">
              <Search />
              <div className="pl-5 py-3 mt-4 bg-white rounded-xl">
                <h4 className="h4 mb-4">Categories</h4>
                <div className="flex flex-col gap-2 text-sm font-light">
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex gap-2 medium-14 text-gray-500"
                    >
                      <input
                        type="checkbox"
                        value={cat}
                        className="w-3"
                        checked={category.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
              <div className="px-4 py-3 mt-6 bg-white rounded-xl">
                <h4 className="h4 mb-4">Sort By</h4>
                <select
                  className="border border-slate-900/50 outline-none text-gray-700 medium-14 h-8 w-full rounded px-2"
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                >
                  {sortOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Right Side - Products */}
          <div className="pr-5 rounded-xl">
            <Title title1={"Product"} title2={"List"} />

            {filterProducts?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6">
                  {getPaginatedProducts().map((product, index) => (
                    <Items product={product} key={index} />
                  ))}
                </div>

                {/* Use the Pagination component */}
                {totalPages > 1 && (
                  <Pagination
                    totalItems={filterProducts.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    className="mt-14 mb-10"
                  />
                )}
              </>
            ) : (
              <p className="no-product">No products found</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Collection;
