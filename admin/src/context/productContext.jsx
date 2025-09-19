import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { backend_url } from "../App";

import { toast } from "react-toastify";

const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      let url;
      if (selectedCategory !== "all") {
        url = `${backend_url}/api/product/category/${selectedCategory}`;
      } else {
        url = `${backend_url}/api/product/list`;
      }

      const response = await axios.get(url);
      if (response.data.success) {
        setAllProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [selectedCategory]); // Only refetch when category changes

  // Get product count
  const productCount = allProducts.length;

  //Handle Remove Product
  const handleRemove = async (id) => {
    try {
      setRemoving(true);
      const response = await axios.post(
        `${backend_url}/api/product/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Remove from local state
        setAllProducts((prev) => prev.filter((product) => product._id !== id));
        // Adjust page if needed
        if (allProducts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to remove product");
    } finally {
      setRemoving(false);
    }
  };

  //Handle Update Product
  const handleProductUpdated = (updatedProduct) => {
    // Update the list with the edited product
    setAllProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    toast.success("Product updated successfully");
  };

  const value = {
    allProducts,
    productCount,
    loading,
    selectedCategory,
    setSelectedCategory,
    fetchAllProducts,
    handleRemove,
    handleProductUpdated,
    removing,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

//Custom Hooke For Admin Context
export const useProductContext = () => {
  const context = useContext(ProductContext);
  return context;
};
