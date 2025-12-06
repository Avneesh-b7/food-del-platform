import React from "react";

function Header() {
  return (
    <>
      <div
        className="relative w-full h-[450px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
        {/* Overlay layer to make text readable */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content area */}
        <div className="relative max-w-6xl mx-auto px-10 text-white">
          <h1 className="text-4xl font-extrabold leading-tight drop-shadow-lg">
            Delicious Meals Delivered Fresh
          </h1>

          <p className="mt-2 text-lg drop-shadow-md">
            Choose from thousands of dishes from restaurants near you.
            <br />
            Fast delivery, top quality and fresh ingredients.
          </p>

          <button className="mt-6 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition-all">
            View Menu
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
