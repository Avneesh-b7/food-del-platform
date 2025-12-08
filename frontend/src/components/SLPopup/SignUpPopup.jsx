import React from "react";

function SignUpPopup({ showLogin, showSignUp }) {
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
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
          />

          <label className="flex gap-2 text-xs text-gray-500">
            <input type="checkbox" /> I agree to the Terms & Conditions
          </label>

          <button className="bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-500 transition">
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
