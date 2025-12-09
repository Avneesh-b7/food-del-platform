import { useState, useContext, React, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { SignUpPopup } from "../SLPopup/SignUpPopup.jsx";

function Navbar({ showLogin, showSignUp }) {
  const [active, setActive] = useState("noneactive");

  const navItems = ["Home", "Menu", "Contact Us"];

  function handleActive(item) {
    setActive(item);
  }

  const { cartItems, setCartItems } = useContext(StoreContext);

  const totalCount = Object.values(cartItems).reduce(
    (sum, value) => sum + value,
    0
  );

  return (
    <>
      <div className="navbar w-full bg-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-2xl">
              <span role="img" aria-label="food"></span>
              🍜
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-800">
              QuickBite
            </span>
          </div>

          {/* Center Nav Links */}
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
            <button
              onClick={() => {
                handleActive("Home");
              }}
              className={`${
                active == "Home"
                  ? "text-red-500 underline font bold"
                  : "hover:text-red-500"
              }`}
            >
              <HashLink smooth to="/">
                Home
              </HashLink>
            </button>

            <button
              onClick={() => {
                handleActive("Menu");
              }}
              className={`${
                active == "Menu"
                  ? "text-red-500 underline font bold"
                  : "hover:text-red-500"
              }`}
            >
              <HashLink smooth to="/#explore-menu-id">
                Menu
              </HashLink>
            </button>

            <button
              onClick={() => {
                handleActive("Contact Us");
              }}
              className={`${
                active == "Contact Us"
                  ? "text-red-500 underline font bold"
                  : "hover:text-red-500"
              }`}
            >
              <HashLink smooth to="/#footer-id">
                Contact Us
              </HashLink>
            </button>
          </nav>

          {/* Right Side: Search + Cart + Sign In */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5">
              <span
                role="img"
                aria-label="search"
                className="text-gray-500 text-sm"
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Search dishes or restaurants"
                className="w-52 border-none text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            {/* Cart Button */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-lg hover:border-red-500 hover:text-red-500 transition-colors">
              <span role="img" aria-label="cart">
                <HashLink smooth to="/cart">
                  🛒
                </HashLink>
              </span>
              {/* Example badge */}
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Sign In Button */}
            <button
              onClick={() => {
                showSignUp(true);
                showLogin(false);
              }}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Navbar;
