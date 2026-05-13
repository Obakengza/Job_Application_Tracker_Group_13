import { Routes, Route, useLocation } from "react-router-dom";

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

  const hideSidebar =
    location.pathname === "/login" || location.pathname.startsWith("/admin");

  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />}

      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProfilePage />} />
          <Route path="/tracking" element={<JobTrackingPage />} />

          <Route path="/jobs" element={<JobPostsPage />} />
          <Route path="/posts" element={<JobPostsPage />} />

          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminJobPosts />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
