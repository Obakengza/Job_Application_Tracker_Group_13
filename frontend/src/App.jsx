import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProfilePage from "./components/ProfilePage";
import JobTrackingPage from "./pages/JobTrackingPage";
import JobPostsPage from "./pages/JobPostsPage";
import LoginPage from "./pages/LoginPage";
<<<<<<< HEAD
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminJobPosts from "./pages/admin/AdminJobPosts";
=======
import JobPostsPage from "./pages/JobPostsPage";
>>>>>>> eee04d7406b7cd3abfa778c1253c0fdaf19449a0

function App() {
  const location = useLocation();

  // Hide sidebar on login and admin pages
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
<<<<<<< HEAD
          <Route path="/jobs" element={<JobPostsPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminJobPosts />} />
=======
          <Route path="/posts" element={<JobPostsPage />} />
>>>>>>> eee04d7406b7cd3abfa778c1253c0fdaf19449a0
        </Routes>
      </div>
    </div>
  );
}

export default App;
