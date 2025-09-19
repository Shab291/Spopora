import React, { useState, useEffect } from "react";
import { useAdminContext } from "../context/adminContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaEdit, FaTrash, FaKey } from "react-icons/fa";

const SubAdminManagement = () => {
  const {
    createSubAdmin,
    subAdmins,
    setSubAdmins,
    updateSubAdmin,
    deleteSubAdmin,
    changeSubAdminPassword,
    admin,
  } = useAdminContext();

  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [changingPasswordFor, setChangingPasswordFor] = useState(null);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    permissions: {
      userManagement: false,
      productManagement: false,
      orderManagement: false,
      contentManagement: false,
    },
  });

  console.log(subAdmins);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("permissions.")) {
      const permissionField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionField]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!editingAdmin && formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    if (editingAdmin) {
      const result = await updateSubAdmin(editingAdmin._id, formData);
      if (result.success) {
        setSubAdmins((prev) =>
          prev.map((a) => (a._id === editingAdmin._id ? result.data : a))
        );
        resetForm();
        toast.success("Sub-admin updated successfully");
      } else {
        toast.error(result.message || "Failed to update sub-admin");
      }
    } else {
      const result = await createSubAdmin(formData);
      if (result.success) {
        setSubAdmins((prev) => [...prev, result.data]);
        resetForm();
        toast.success("Sub-admin created successfully");
      } else {
        toast.error(result.message || "Failed to create sub-admin");
      }
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await changeSubAdminPassword(
      changingPasswordFor,
      newPassword
    );
    if (result.success) {
      setNewPassword("");
      setConfirmPassword("");
      setChangingPasswordFor(null);
      toast.success("Password changed successfully");
    } else {
      toast.error(result.message || "Failed to change password");
    }
    setLoading(false);
  };

  const handleEdit = (subAdmin) => {
    setEditingAdmin(subAdmin);
    setFormData({
      name: subAdmin.name,
      email: subAdmin.email,
      password: "",
      role: subAdmin.role,
      permissions: subAdmin.permissions || {
        userManagement: false,
        productManagement: false,
        orderManagement: false,
        contentManagement: false,
      },
    });
    setShowForm(true);
  };

  const handleDelete = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this sub-admin?")) {
      setLoading(true);
      const result = await deleteSubAdmin(adminId);
      if (result.success) {
        setSubAdmins((prev) => prev.filter((a) => a._id !== adminId));
        toast.success("Sub-admin deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete sub-admin");
      }
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
      permissions: {
        userManagement: false,
        productManagement: false,
        orderManagement: false,
        contentManagement: false,
      },
    });
    setEditingAdmin(null);
    setShowForm(false);
  };

  // Only show this functionality for superadmin
  if (admin.role !== "superadmin") {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Sub-Admin Management
        </h2>
        <p className="text-gray-600">Only superadmin can manage sub-admins.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Sub-Admin Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          Add Sub-Admin
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingAdmin ? "Edit Sub-Admin" : "Create New Sub-Admin"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  disabled={!!editingAdmin || loading}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              {!editingAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password * (min 8 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showCreatePassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                      required
                      minLength="8"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCreatePassword(!showCreatePassword)}
                      disabled={loading}
                    >
                      {showCreatePassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={loading}
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(formData.permissions).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`permissions.${key}`}
                      checked={value}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={loading}
                    />
                    <span className="text-sm">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Processing..." : editingAdmin ? "Update" : "Create"}{" "}
                Sub-Admin
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {changingPasswordFor && (
        <div className="mb-6 p-4 border rounded-lg bg-yellow-50">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password * (min 8 characters)
              </label>
              <div className="relative">
                <input
                  type={showChangePassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                  required
                  minLength="8"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  disabled={loading}
                >
                  {showChangePassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                type={showChangePassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={loading}
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Processing..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setChangingPasswordFor(null);
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        {loading && !showForm && !changingPasswordFor && (
          <div className="text-center py-4">Loading sub-admins...</div>
        )}

        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Permissions</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {subAdmins.length > 0 ? (
              <>
                {subAdmins.map((subAdmin) => (
                  <tr key={subAdmin._id} className="border-b">
                    <td className="px-4 py-2">{subAdmin.name}</td>
                    <td className="px-4 py-2">{subAdmin.email}</td>
                    <td className="px-4 py-2 capitalize">{subAdmin.role}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          subAdmin.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subAdmin.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        {subAdmin.permissions &&
                        Object.entries(subAdmin.permissions).some(
                          ([_, value]) => value
                        ) ? (
                          Object.entries(subAdmin.permissions)
                            .filter(([_, value]) => value)
                            .map(([key]) => (
                              <span
                                key={`${subAdmin._id}-${key}`}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                              >
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </span>
                            ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            No permissions
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(subAdmin)}
                          className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                          title="Edit"
                          disabled={loading}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setChangingPasswordFor(subAdmin._id)}
                          className="text-green-600 hover:text-green-800 disabled:text-gray-400"
                          title="Change Password"
                          disabled={loading}
                        >
                          <FaKey />
                        </button>
                        <button
                          onClick={() => handleDelete(subAdmin._id)}
                          className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                          title="Delete"
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              !loading && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    No sub-admins found
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubAdminManagement;
