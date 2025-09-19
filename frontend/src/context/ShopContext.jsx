import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const [search, setSearch] = useState("");
  const [cartItem, setCartItem] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = "$";
  const delivery_charges = 10;
  const navigate = useNavigate();

  // Helper function to get product price based on category and volume
  const getProductPrice = (product, volume = "") => {
    const volumeBasedCategories = ["liquids", "Perfumes", "cosmetics"];

    // If it's a volume-based category and volume is specified with a price
    if (
      volumeBasedCategories.includes(product.category) &&
      volume &&
      product.volumePricing &&
      product.volumePricing[volume]
    ) {
      return product.volumePricing[volume];
    }

    // Return regular price for all other cases
    return product.price;
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  //Getting User cart from Database
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItem(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //Store the Cart items in Cart as User Change
  useEffect(() => {
    if (token) {
      getUserCart(token);
    } else {
      setCartItem({}); // Clear cart on logout
    }
  }, [token]);

  //Adding Items to Cart with enhanced attributes
  const addToCart = async (itemId, color = "", size = "", volume = "") => {
    // Create a unique key for this combination of attributes
    const itemKey = `${itemId}-${color}-${size}-${volume}`;

    let cartData = structuredClone(cartItem);

    if (cartData[itemKey]) {
      cartData[itemKey].quantity += 1;
    } else {
      cartData[itemKey] = {
        quantity: 1,
        color: color,
        size: size,
        volume: volume,
      };
    }

    setCartItem(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          {
            itemId,
            color,
            size,
            volume,
          },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  //Getting total cart count
  const getCartCount = () => {
    let totalCount = 0;
    for (const itemKey in cartItem) {
      try {
        if (cartItem[itemKey].quantity > 0) {
          totalCount += cartItem[itemKey].quantity;
        }
      } catch (error) {
        console.error("Error counting cart items:", error);
      }
    }
    return totalCount;
  };

  //Update the Cart Quantity
  const updateQuantity = async (itemKey, quantity) => {
    let cartData = structuredClone(cartItem);

    if (cartData[itemKey]) {
      if (quantity <= 0) {
        delete cartData[itemKey];
      } else {
        cartData[itemKey].quantity = quantity;
      }

      setCartItem(cartData);

      if (token) {
        try {
          // Extract attributes from the key
          const [itemId, color, size, volume] = itemKey.split("-");

          if (quantity <= 0) {
            await axios.post(
              backendUrl + "/api/cart/remove",
              {
                itemId,
                color,
                size,
                volume,
              },
              { headers: { token } }
            );
          } else {
            await axios.post(
              backendUrl + "/api/cart/update",
              {
                itemId,
                color,
                size,
                volume,
                quantity,
              },
              { headers: { token } }
            );
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemKey) => {
    let cartData = structuredClone(cartItem);

    if (cartData[itemKey]) {
      delete cartData[itemKey];
      setCartItem(cartData);

      if (token) {
        try {
          const [itemId, color, size, volume] = itemKey.split("-");

          await axios.post(
            backendUrl + "/api/cart/remove",
            {
              itemId,
              color,
              size,
              volume,
            },
            { headers: { token } }
          );
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
  };

  //getting Total Cart Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemKey in cartItem) {
      try {
        if (cartItem[itemKey].quantity > 0) {
          // Extract just the itemId from the key (first part before first dash)
          const itemId = itemKey.split("-")[0];
          const itemInfo = products.find((product) => product._id === itemId);

          if (itemInfo) {
            // Get the volume from cart item if available
            const volume = cartItem[itemKey].volume || "";

            // Use the helper function to get the correct price
            const itemPrice = getProductPrice(itemInfo, volume);
            totalAmount += itemPrice * cartItem[itemKey].quantity;
          }
        }
      } catch (error) {
        console.error("Error calculating cart amount:", error);
      }
    }
    return totalAmount;
  };

  // Get cart items with full product information
  const getCartItemsWithDetails = () => {
    const cartItems = [];

    for (const itemKey in cartItem) {
      if (cartItem[itemKey].quantity > 0) {
        const itemId = itemKey.split("-")[0];
        const product = products.find((p) => p._id === itemId);

        if (product) {
          // Get the volume from cart item if available
          const volume = cartItem[itemKey].volume || "";

          // Use the helper function to get the correct price
          const itemPrice = getProductPrice(product, volume);

          cartItems.push({
            ...cartItem[itemKey],
            itemKey,
            product,
            itemPrice, // Add individual item price
            totalPrice: itemPrice * cartItem[itemKey].quantity,
          });
        }
      }
    }

    return cartItems;
  };

  useEffect(() => {
    // Set token and user on app load
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const value = {
    products,
    search,
    setSearch,
    currency,
    delivery_charges,
    navigate,
    cartItem,
    setCartItem,
    addToCart,
    getCartCount,
    updateQuantity,
    removeFromCart,
    getCartAmount,
    getCartItemsWithDetails,
    backendUrl,
    token,
    setToken,
    user,
    setUser,
    loading,
    setLoading,
    getProductPrice, // Export the helper function for use in components
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

//Custom Hook to export ShopContext
export const useShopContext = () => {
  const context = useContext(ShopContext);
  return context;
};
