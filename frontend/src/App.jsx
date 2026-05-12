import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProfilePage from "./components/ProfilePage";
import JobTrackingPage from "./pages/JobTrackingPage";
import JobPostsPage from "./pages/JobPostsPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminJobPosts from "./pages/admin/AdminJobPosts";

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
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminJobPosts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
