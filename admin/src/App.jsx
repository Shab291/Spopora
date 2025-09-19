import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashBoard from "./pages/AdminDashBoard";
import SideBar from "./components/SideBar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import EmailCamp from "./pages/EmailCamp";
import { useAdminContext } from "./context/adminContext";

export const backend_url = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

export default function App() {
  const { token, admin, loading, logout } = useAdminContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main>
      <ToastContainer />
      {!token ? (
        <Login />
      ) : (
        <div className="bg-slate-100 text-[#404040]">
          <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row">
            <SideBar admin={admin} />
            <div className="mt-20 sm:mt-0 sm:ml-[20%] w-full sm:w-4/5 p-4">
              <Routes>
                <Route
                  path="/"
                  element={<AdminDashBoard onLogout={logout} />}
                />
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/emailCamp" element={<EmailCamp />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
