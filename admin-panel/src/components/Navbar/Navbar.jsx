import { React, useState } from "react";

// PROMPT
// const Navbar = () => {
//   return (
//     <div>
//       <h1>rhis is the navbar component </h1>
//       {/*
//     //1. this should have the name of my app on the top left - Quick Bites
//     //2.  then there should be a tagline jsut below it
//     //3.  on the right side ew should have an use image icon along with his name at the bottom and his role (i.e. admin)
//     //4.  make it responsive to mobile as well
//     //5. make it look professional and clean
//     //6. use tailwind css to make it look professional and clean
//      // 7. give a usage guideline (not more than 2 lines on the top of your output as a comment)
//     */}
//     </div>
//   );
// };

// Navbar.jsx
// Professional, slightly-red themed admin navbar built with Tailwind CSS.
// Usage: <Navbar user={{ name: 'Asha Rao', role: 'Admin', avatarUrl: 'https://...' }} />

function Navbar({ user = {} }) {
  const [open, setOpen] = useState(false);
  const name = user.name || "Admin User";
  const role = user.role || "Admin";
  const avatar =
    user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=ef4444&color=ffffff&bold=true`;

  return (
    <header className="bg-white/60 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-red-600 to-red-400 flex items-center justify-center shadow-md">
                🍜
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-lg font-semibold text-gray-900">
                  Quick Bites
                </span>
                <span className="text-xs text-gray-500">
                  Fresh food, fast delivery
                </span>
              </div>
            </div>
          </div>

          {/* Right: user / actions */}
          <div className="flex items-center gap-4">
            {/* Desktop user card */}
            <div className="hidden md:flex items-center gap-3 pr-2">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-gray-900">
                  {name}
                </span>
                <span className="text-xs text-gray-500">{role}</span>
              </div>
              <img
                src={avatar}
                alt={`${name} avatar`}
                className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
              />
            </div>

            {/* Mobile: avatar + name under */}
            <button
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 md:hidden"
            >
              {/* hamburger / close */}
              {open ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Desktop actions placeholder (could add notifications/settings) */}
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt={`${name} avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">{name}</div>
                <div className="text-xs text-gray-500">{role}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  /* placeholder - navigate to profile */
                }}
                className="px-3 py-1 rounded-md text-sm bg-red-50 text-red-700 border border-red-100 hover:bg-red-100"
              >
                Profile
              </button>
              <button className="px-3 py-1 rounded-md text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
