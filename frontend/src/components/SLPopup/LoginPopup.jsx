import React from "react";

function LoginPopup({ showLogin, showSignUp }) {
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

        {/* Form Inputs */}
        <div className="flex flex-col gap-3">
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

          <button className="bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-500 transition">
            Login
          </button>
        </div>

        <p className="text-center text-xs mt-4 text-gray-500">
          New user?{" "}
          <span
            onClick={() => {
              showLogin(false);
              showSignUp(true);
            }}
            className="text-red-600 font-semibold cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export { LoginPopup };
