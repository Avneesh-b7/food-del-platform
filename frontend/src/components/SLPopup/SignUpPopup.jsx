import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

function SignUpPopup({ showLogin, showSignUp }) {
  const { base_url } = useContext(StoreContext);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    role: "USER",
    password: "",
    termsAccepted: false,
  });

  // useEffect(() => {
  //   console.log(userData);
  // }, [userData]);

  // Handle input updates
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSignupData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle submit logic
  const handleSignup = async () => {
    try {
      // Basic required fields check
      if (!signupData.name || !signupData.email || !signupData.password) {
        toast.error("Please fill in all required fields.");
        return;
      }

      if (!signupData.termsAccepted) {
        toast.error("You must accept the Terms & Conditions.");
        return;
      }

      // Send request
      const response = await axios.post(`${base_url}/user/register`, {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        role: signupData.role, // default USER
      });

      if (response.data.success) {
        toast.success("Account created successfully!");

        // Close popup and show login
        showSignUp(false);
        showLogin(true);

        // Optionally clear form
        setSignupData({
          name: "",
          email: "",
          password: "",
          role: "USER",
          termsAccepted: false,
        });
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Signup Error:", err);

      // Backend-provided message
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong. Please try again.";

      toast.error(backendMsg);
    }
  };

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

        <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>

        {/* Form Inputs */}
        <div className="flex flex-col gap-3">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={signupData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={signupData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={signupData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
          />

          <label className="flex gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              name="termsAccepted"
              value={signupData.termsAccepted}
              onChange={handleChange}
            />{" "}
            I agree to the Terms & Conditions
          </label>

          <button
            onClick={handleSignup}
            className="bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-500 transition"
          >
            Sign Up
          </button>
        </div>

        <p className="text-center text-xs mt-4 text-gray-500">
          Already a user?{" "}
          <span
            onClick={() => {
              showLogin(true);
              showSignUp(false);
            }}
            className="text-red-600 font-semibold cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export { SignUpPopup };
