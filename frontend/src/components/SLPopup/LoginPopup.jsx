import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext.jsx";

function LoginPopup({ showLogin, showSignUp }) {
  const { base_url, setUser, setAccessToken, setIsAuthenticated } =
    useContext(StoreContext);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      // Validation
      if (!loginData.email || !loginData.password) {
        toast.error("Please enter email and password.");
        return;
      }

      // Call backend API
      const response = await axios.post(`${base_url}/user/login`, {
        email: loginData.email,
        password: loginData.password,
      });

      if (response.data.success) {
        toast.success("Login successful!");

        /** -------------------------------
         * TOKEN STORAGE STRATEGY
         * -------------------------------
         * ✔ accessToken -> React Context (memory)
         * ✔ refreshToken -> localStorage (persistent)
         -------------------------------- */

        // Store refresh token in localStorage
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Store access token in React Context for in-app usage
        setAccessToken(response.data.accessToken);
        setIsAuthenticated(true);
        localStorage.setItem("accessToken", response.data.accessToken);

        // Store user globally
        setUser(response.data.user);
        //also store user in local storage to display name when refreshed
        localStorage.setItem("user", response.data.user.name);

        // Close popup
        showLogin(false);
        showSignUp(false);

        // Clear email/password
        setLoginData({ email: "", password: "" });
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login Error:", err);

      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed. Please try again.";

      toast.error(errMsg);
    }
  };

  // useEffect(() => {
  //   console.log(loginData);
  // }, [loginData]);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[350px] p-6 rounded-2xl shadow-lg relative">
        {/* Close button */}
        <button
          onClick={() => {
            showLogin(false);
            showSignUp(false);
          }}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <div className="flex flex-col gap-3">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={loginData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
          />

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-500 transition"
          >
            Login
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-4 text-gray-500">
          New here?{" "}
          <span
            onClick={() => {
              showLogin(false);
              showSignUp(true);
            }}
            className="text-red-600 font-semibold cursor-pointer"
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}

export { LoginPopup };
