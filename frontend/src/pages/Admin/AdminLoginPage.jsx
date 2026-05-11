import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = () => {
    // For now just go to admin dashboard
    // Later this will verify admin credentials with the backend
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - decorative panel */}
      <div
        className="hidden md:flex w-1/2 flex-col items-center justify-center p-12"
        style={{ background: "linear-gradient(135deg, #C1E2E4, #89c4c8)" }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#E8930C" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-700">Job Tracker</h1>
          <p className="text-gray-500 mt-2">Admin Portal</p>
        </div>

        {/* Decorative circles */}
        <div className="relative w-64 h-64 mt-8">
          <div
            className="absolute inset-0 rounded-full opacity-40"
            style={{ background: "#C1E2E4" }}
          ></div>
          <div
            className="absolute inset-8 rounded-full opacity-50"
            style={{ background: "#a8d4d7" }}
          ></div>
          <div
            className="absolute inset-16 rounded-full opacity-60"
            style={{ background: "#89c4c8" }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-600 text-center text-sm px-8 font-medium">
              Manage job posts and help users find their next opportunity
            </p>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h2>
          <p className="text-gray-400 text-sm mb-6">
            Only authorised admins can access this page
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full text-white font-bold py-3 rounded-xl mt-2 transition-colors"
              style={{ background: "#E8930C" }}
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
