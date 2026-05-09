import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [activeTab, setActiveTab] = useState("signin");

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const [signUpForm, setSignUpForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/");
  };

  const handleSignUp = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - decorative panel */}
      <div
        className="hidden md:flex w-1/2 flex-col items-center justify-center p-12"
        style={{ background: "linear-gradient(135deg, #C1E2E4, #89c4c8)" }}
      >
        {/* App logo/name */}
        <div className="mb-8 text-center">
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
          <p className="text-gray-500 mt-2">
            Manage your job applications with ease
          </p>
        </div>

        {/* Decorative circles */}
        <div className="relative w-64 h-64">
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
              Track applications, interviews and offers all in one place
            </p>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Welcome text */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {activeTab === "signin" ? "Welcome Back" : "Create Account"}
          </h2>

          {/* Sign In / Sign Up toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab("signin")}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                activeTab === "signin"
                  ? { background: "#E8930C", color: "white" }
                  : { color: "#888" }
              }
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                activeTab === "signup"
                  ? { background: "#E8930C", color: "white" }
                  : { color: "#888" }
              }
            >
              Sign Up
            </button>
          </div>

          {/* Sign In form */}
          {activeTab === "signin" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ focusBorderColor: "#C1E2E4" }}
                  value={signInForm.email}
                  onChange={(e) =>
                    setSignInForm({ ...signInForm, email: e.target.value })
                  }
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
                  value={signInForm.password}
                  onChange={(e) =>
                    setSignInForm({ ...signInForm, password: e.target.value })
                  }
                />
              </div>

              <button
                onClick={handleSignIn}
                className="w-full text-white font-bold py-3 rounded-xl mt-2 transition-colors"
                style={{ background: "#E8930C" }}
              >
                Continue
              </button>

              <div className="text-center text-sm text-gray-400">
                Or Continue With
              </div>

              <button className="w-full border border-gray-200 rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                Sign In with Google
              </button>
            </div>
          )}

          {/* Sign Up form */}
          {activeTab === "signup" && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm text-gray-500 mb-1 block">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Yanelisa"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                    value={signUpForm.firstName}
                    onChange={(e) =>
                      setSignUpForm({
                        ...signUpForm,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-500 mb-1 block">
                    Surname
                  </label>
                  <input
                    type="text"
                    placeholder="Busakwe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                    value={signUpForm.surname}
                    onChange={(e) =>
                      setSignUpForm({ ...signUpForm, surname: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                  value={signUpForm.email}
                  onChange={(e) =>
                    setSignUpForm({ ...signUpForm, email: e.target.value })
                  }
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
                  value={signUpForm.password}
                  onChange={(e) =>
                    setSignUpForm({ ...signUpForm, password: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                  value={signUpForm.confirmPassword}
                  onChange={(e) =>
                    setSignUpForm({
                      ...signUpForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={handleSignUp}
                className="w-full text-white font-bold py-3 rounded-xl mt-2 transition-colors"
                style={{ background: "#E8930C" }}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
