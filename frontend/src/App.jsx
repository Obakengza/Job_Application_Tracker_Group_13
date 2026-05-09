import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProfilePage from "./components/ProfilePage";
import JobTrackingPage from "./pages/JobTrackingPage";

function App() {
  return (
    <div className="flex">
      {/* Sidebar - always visible */}
      <Sidebar />

      {/* Page content - changes based on URL */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<ProfilePage />} />
          <Route path="/tracking" element={<JobTrackingPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
