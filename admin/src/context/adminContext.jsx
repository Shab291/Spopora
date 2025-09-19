import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { backend_url } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [subAdmins, setSubAdmins] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [userRegistration, setUserRegistration] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [orders, setOrders] = useState([]);
  const [orderRegistration, setOrderRegistration] = useState(null);
  const [ordersStats, setOrdersStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    // Check if token exists and validate it
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  //Validate Token already set in local Storage
  const validateToken = async () => {
    try {
      const storedAdmin = localStorage.getItem("admin");
      if (storedAdmin) {
        setAdmin(JSON.parse(storedAdmin));
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  //Admin Login Functionality
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${backend_url}/api/admin/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const { token: newToken, admin: adminData } = response.data;
        setToken(newToken);
        setAdmin(adminData);
        localStorage.setItem("adminToken", newToken);
        localStorage.setItem("admin", JSON.stringify(adminData));
        toast.success("Login successful!");
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  //Admin Logout Functionality
  const logout = () => {
    setToken(null);
    setAdmin(null);
    setOrders([]);
    setOrdersStats([]);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    toast.info("Logged out successfully");
  };

  //Call API for Admin Profile Update
  const AdminProfileUpdate = async (adminId, name, email) => {
    try {
      setLoading(true);

      const response = await axios.put(
        backend_url + `/api/admin/${adminId}/profile`,
        { name, email },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setAdmin((prev) => ({ ...prev, name, email }));
        return true;
      } else {
        toast.error(response.data.message || "Failed to update Profile");
        return false;
      }
    } catch (error) {
      console.error("Error Updating Admin Profile", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  //Call API for Admin Password Update
  const updateAdminPassword = async (adminId, currentPassword, newPassword) => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${backend_url}/api/admin/${adminId}/password`,
        { currentPassword, newPassword },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Password updated successfully!");
        return true;
      } else {
        toast.error(response.data.message || "Failed to update password");
        return false;
      }
    } catch (error) {
      console.error("Error Updating Admin Password", error);
      toast.error(error.response?.data?.message || "Password update failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  //Fetch all Sub Admins
  const fetchSubAdmins = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${backend_url}/api/admin/subadmins`, {
        headers: { token },
      });

      if (response.data.success) {
        setSubAdmins(response.data.subAdmins);
        return { success: true, data: response.data.subAdmins };
      }
    } catch (error) {
      console.error("Error fetching sub-admins", error);
      const message =
        error.response?.data?.message || "Failed to fetch sub-admins";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Call API for Creating Sub-Admin
  const createSubAdmin = async (subAdminData) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${backend_url}/api/admin/subadmin`,
        subAdminData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Sub-admin created successfully!");
        return { success: true, data: response.data.admin };
      } else {
        toast.error(response.data.message || "Failed to create sub-admin");
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Error creating sub-admin", error);
      const message =
        error.response?.data?.message || "Sub-admin creation failed";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Call API for Updating Sub-Admin
  const updateSubAdmin = async (adminId, updateData) => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${backend_url}/api/admin/subadmin/${adminId}`,
        updateData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Sub-admin updated successfully!");
        return { success: true, data: response.data.admin };
      } else {
        toast.error(response.data.message || "Failed to update sub-admin");
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Error updating sub-admin", error);
      const message =
        error.response?.data?.message || "Sub-admin update failed";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Call API for Deleting Sub-Admin
  const deleteSubAdmin = async (adminId) => {
    try {
      setLoading(true);

      const response = await axios.delete(
        `${backend_url}/api/admin/subadmin/${adminId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Sub-admin deleted successfully!");
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to delete sub-admin");
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Error deleting sub-admin", error);
      const message =
        error.response?.data?.message || "Sub-admin deletion failed";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Call API for Changing Sub-Admin Password
  const changeSubAdminPassword = async (adminId, newPassword) => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${backend_url}/api/admin/subadmin/${adminId}/password`,
        { newPassword },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Sub-admin password changed successfully!");
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to change password");
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Error changing sub-admin password", error);
      const message = error.response?.data?.message || "Password change failed";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  //Fetch All Orders API call
  const fetchAllOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${backend_url}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
        setOrderRegistration(Number(response.data.orderRegistration));
      } else {
        throw new Error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Order fetch error:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  //Order Status API calls

  const statusHandler = async (orderId, event) => {
    try {
      const response = await axios.post(
        `${backend_url}/api/order/status`,
        { orderId, status: event },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders(); // Refresh orders
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //Fetch all Revenue Status
  const fetchRevenueStats = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        backend_url + "/api/order/getRevenueStats",
        { headers: { token } }
      );

      if (response.data.success) {
        setOrdersStats(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  //Fetch All Users
  const fetchAllUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(backend_url + "/api/user/getall", {
        headers: { token },
      });

      if (response.data.success) {
        setUserCount(response.data.count);
        setUserRegistration(response.data.latestRegistration);
      } else {
        console.log("Failed to get Users.");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllUsers();
      fetchSubAdmins();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchAllOrders();
      fetchRevenueStats();
    }
  }, [token, userCount]);

  const value = {
    admin,
    login,
    logout,
    token,
    orders,
    ordersStats,
    userCount,
    statusHandler,
    loading,
    navigate,
    isAuthenticated: !!token,
    error,
    userRegistration,
    orderRegistration,
    updateAdminPassword,
    AdminProfileUpdate,
    createSubAdmin,
    subAdmins,
    setSubAdmins,
    updateSubAdmin,
    deleteSubAdmin,
    changeSubAdminPassword,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  return context;
};
