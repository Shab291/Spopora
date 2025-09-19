import { useState, useEffect } from "react";
import { useAdminContext } from "../context/adminContext";
import { useProductContext } from "../context/productContext";
import {
  FaUser,
  FaLock,
  FaSignOutAlt,
  FaUserEdit,
  FaChartBar,
  FaShoppingCart,
  FaUsers,
  FaCog,
} from "react-icons/fa";
import { CustomAlert } from "../components/Alert";
import { toast } from "react-toastify";
import SubAdminManagement from "../components/subAdmin";

const AdminDashboard = ({ onLogout }) => {
  const {
    admin,
    ordersStats,
    userCount,
    userRegistration,
    orderRegistration,
    updateAdminPassword,
    AdminProfileUpdate,
  } = useAdminContext();

  const { productCount } = useProductContext();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    conversionRate,
    deliveredOrders,
    deliveredRevenue,
    nonDeliveredOrders,
    paidOrders,
    paymentMethodBreakdown,
    pendingAmount,
    statusBreakdown,
    unpaidOrders,
  } = ordersStats;

  const confirmLogout = () => {
    onLogout();
    setShowLogoutAlert(false);
  };

  const cancelLogout = () => {
    setShowLogoutAlert(false);
  };

  useEffect(() => {
    if (admin) {
      setAdminData((prev) => ({
        ...prev,
        name: admin.name || "",
        email: admin.email || "",
      }));
    }
  }, [admin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    // Validate input
    if (!adminData.name.trim() || !adminData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    // Check if data actually changed
    if (adminData.name === admin.name && adminData.email === admin.email) {
      toast.info("No changes made to profile");
      return;
    }

    AdminProfileUpdate(admin._id, adminData.name, adminData.email);

    setAdminData((prev) => ({
      ...prev,
      name: adminData.name,
      email: adminData.email,
    }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Handle password change logic here
    if (adminData.newPassword !== adminData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    updateAdminPassword(
      admin._id,
      adminData.currentPassword,
      adminData.newPassword
    );

    setAdminData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-2 ">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Sopopora Admin Panel
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-gray-800">{admin.name}</p>
              <p className="text-sm text-gray-500">{admin.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
              {admin.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Panel */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 mb-8 text-slate-800">
          <h2 className="text-2xl font-bold mb-2">
            Welcome to Sopopora Admin Panel
          </h2>
          <p className="mb-4">
            Hello {admin.name}, here's what's happening with your store today.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#90caf9] p-4 rounded-lg">
              <h3 className="font-semibold">Total Orders</h3>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <div className="bg-[#90caf9] p-4 rounded-lg">
              <h3 className="font-semibold">Total Revenue</h3>
              <p className="text-2xl font-bold">{totalRevenue}</p>
            </div>
            <div className="bg-[#90caf9] p-4 rounded-lg">
              <h3 className="font-semibold">Total Products</h3>
              <p className="text-2xl font-bold">{productCount}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-4">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {admin.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{admin.name}</h3>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                  <p className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block mt-1">
                    {admin.role}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                <p>Last login: {new Date().toLocaleDateString()}</p>
                <p>
                  Status: <span className="text-green-600">Active</span>
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-left ${
                  activeTab === "dashboard"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaChartBar className="text-gray-500" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-left ${
                  activeTab === "profile"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaUser className="text-gray-500" />
                <span>Profile Settings</span>
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-left ${
                  activeTab === "password"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaLock className="text-gray-500" />
                <span>Change Password</span>
              </button>
              <button
                onClick={() => setActiveTab("subAdmin")}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-left ${
                  activeTab === "subAdmin"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaUsers className="text-gray-500" />
                <span>Sub-Admins</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-left ${
                  activeTab === "settings"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaCog className="text-gray-500" />
                <span>System Settings</span>
              </button>
              <button
                onClick={() => setShowLogoutAlert(true)}
                className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-100"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {activeTab === "dashboard" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Dashboard Overview
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-800">
                      Registered Users
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {userCount}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <h3 className="font-semibold text-green-800">
                      Order Delivered
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {deliveredOrders}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <h3 className="font-semibold text-purple-800">
                      Pending Orders
                    </h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {nonDeliveredOrders}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-800">Paid Orders</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {paidOrders}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <h3 className="font-semibold text-green-800">
                      Unpaid Orders
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {unpaidOrders}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <h3 className="font-semibold text-purple-800">
                      Pending Amount
                    </h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {pendingAmount}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-800">COD Orders</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {paymentMethodBreakdown?.cod}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <h3 className="font-semibold text-green-800">
                      Stripe Order
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {paymentMethodBreakdown?.Stripe}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Recent Activities
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUserEdit className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            New user registration
                          </p>
                          <p className="text-xs text-gray-500">
                            {userRegistration &&
                              new Date(userRegistration).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                }
                              )}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        User
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <FaShoppingCart className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            New order placed
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(orderRegistration).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Order
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Profile Settings
                </h2>
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={adminData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={adminData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Role
                    </label>
                    <input
                      type="text"
                      id="role"
                      value={admin.role}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Contact superadmin to change role
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Change Password
                </h2>
                <form onSubmit={handleChangePassword}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={adminData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={adminData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={adminData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            )}

            {activeTab === "subAdmin" && <SubAdminManagement />}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  System Settings
                </h2>
                <p className="text-gray-600">
                  System settings functionality will be implemented here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Alert Dialog */}
      <CustomAlert
        show={showLogoutAlert}
        message="Are you sure you want to exit?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
};

export default AdminDashboard;
