import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProfilePage from "./components/ProfilePage";
import JobTrackingPage from "./pages/JobTrackingPage";
import LoginPage from "./pages/LoginPage";
import JobPostsPage from "./pages/JobPostsPage";

function App() {
  const location = useLocation();

  // Don't show sidebar on login page
  const hideSidebar = location.pathname === "/login";

  return (
    <div className="flex">
      {/* Only show sidebar if not on login page */}
      {!hideSidebar && <Sidebar />}

      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProfilePage />} />
          <Route path="/tracking" element={<JobTrackingPage />} />
          <Route path="/posts" element={<JobPostsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
