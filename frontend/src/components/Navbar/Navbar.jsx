import { useState, useContext, React } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { toast } from "react-toastify";

function Navbar({ showLogin, showSignUp }) {
  const [active, setActive] = useState("noneactive");

  const {
    cartItems,
    user,
    setUser,
    accessToken,
    setAccessToken,
    handleLogout,
  } = useContext(StoreContext);

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
              🍜
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-800">
              QuickBite
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
            <HashLink
              smooth
              to="/"
              className={`${
                active === "Home"
                  ? "text-red-500 underline"
                  : "hover:text-red-500"
              }`}
              onClick={() => setActive("Home")}
            >
              Home
            </HashLink>

            <HashLink
              smooth
              to="/#explore-menu-id"
              className={`${
                active === "Menu"
                  ? "text-red-500 underline"
                  : "hover:text-red-500"
              }`}
              onClick={() => setActive("Menu")}
            >
              Menu
            </HashLink>

            <HashLink
              smooth
              to="/#footer-id"
              className={`${
                active === "Contact Us"
                  ? "text-red-500 underline"
                  : "hover:text-red-500"
              }`}
              onClick={() => setActive("Contact Us")}
            >
              Contact Us
            </HashLink>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5">
              🔍
              <input
                type="text"
                placeholder="Search dishes or restaurants"
                className="w-52 border-none text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-lg hover:border-red-500 hover:text-red-500 transition-colors"
            >
              🛒
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* ============================
                 CONDITIONAL AUTH VIEW
               ============================ */}
            {!accessToken ? (
              // User NOT logged in → Show Sign In
              <button
                onClick={() => {
                  showSignUp(true);
                  showLogin(true);
                }}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
              >
                Sign In
              </button>
            ) : (
              // User logged in → Show User Icon + Logout
              <div className="flex items-center gap-3">
                {/* <div
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xl"
                  title={user?.name || "User"}
                >
                  `{"Hello " + user.name}`
                </div> */}
                <div className="flex flex-col items-center">
                  {/* User Icon */}
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xl">
                    ⛄︎
                  </div>

                  {/* Hello Message */}
                  <span className="text-xs text-gray-700 font-medium mt-1">
                    {user?.name || "User"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
