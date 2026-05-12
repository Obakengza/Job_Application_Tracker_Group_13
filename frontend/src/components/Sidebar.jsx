import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-56 min-h-screen bg-white border-r border-gray-200 p-6 flex flex-col gap-2">
      {/* App name / logo */}
      <h1 className="text-lg font-bold mb-6">Job Tracker</h1>

    <Link
      to="/dashboard"
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        ${location.pathname === "/dashboard" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
      >

        Profile
      </Link>

      <Link
        to="/tracking"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          ${location.pathname === "/tracking" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
      >
          Dashboard
      </Link>

      <Link
        to="/"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          ${location.pathname === "/" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
      >
        Job Tracking
      </Link>

      <Link
        to="/posts"
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          ${location.pathname === "/posts" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
      >
        Job Posts
      </Link>
    </div>
  );
}

export default Sidebar;