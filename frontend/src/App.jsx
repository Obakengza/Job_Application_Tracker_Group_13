import { Navigate, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProfilePage from "./components/ProfilePage";
import JobTrackingPage from "./pages/JobTrackingPage";
import JobPostsPage from "./pages/JobPostsPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import AdminJobPosts from "./pages/Admin/AdminJobPosts";
import DashboardPage from "./pages/DashboardPage";
function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideSidebar =
    location.pathname === "/login" || location.pathname.startsWith("/admin");

  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const showUserLogout =
    location.pathname !== "/login" && !location.pathname.startsWith("/admin");

  const handleLogout = async () => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    try {
      if (access && refresh) {
        await fetch("http://127.0.0.1:8000/api/auth/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ refresh }),
        });
      }
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("isAdmin");
      navigate("/login");
    }
  };

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}

      {showUserLogout && (
        <button
          onClick={handleLogout}
          className="fixed left-6 bottom-6 z-50 rounded-lg bg-white px-4 py-2 text-sm font-bold text-red-600 shadow border border-red-100 hover:bg-red-50"
        >
          Logout
        </button>
      )}

      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProfilePage />} />
          <Route path="/tracking" element={<JobTrackingPage />} />

          <Route path="/jobs" element={<JobPostsPage />} />
          <Route path="/posts" element={<JobPostsPage />} />

          <Route path="/admin" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={isAdmin ? <AdminJobPosts /> : <Navigate to="/admin" replace />}
          />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
