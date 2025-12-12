// import { React, useState } from "react";
// import { NavLink } from "react-router-dom";

// PROMPT
// const Sidebar = () => {
//   return (
//     <div>
//       <h1>this is the sidebar component</h1>
//       {/*
// //     //1. this should be on the left of the screen and should look and feel like a sidebar
// //     //2.  it should have 2 selections / buttons namely - 1. Add Items , 2. List Items , 3. Orders
// //     //3.  add appropirate emojis to these buttons.selectors
// //     //4.  make it responsive to mobile as well
// //     //5. make it look professional and clean
// //     //6. use tailwind css to make it look professional and clean
// //      // 7. give a usage guideline (not more than 2 lines on the top of your output as a comment)
// //     */}
//     </div>
//   );
// };

// Usage: <Sidebar /> — sidebar without navigation paths yet.

// export default function Sidebar() {
//   const [open, setOpen] = useState(false);

//   const navItems = [
//     { name: "Add Items", icon: "🍽️", drivesto: "/add" },
//     { name: "List Items", icon: "📋", drivesto: "/list" },
//     { name: "Orders", icon: "🛒", drivesto: "/orders" },
//   ];

//   return (
//     <>
//       {/* Mobile header / toggle */}
//       <div className="md:hidden flex justify-between items-center px-4 py-3 border-b bg-white sticky top-0 z-50">
//         <span className="font-semibold text-gray-800 text-lg">Quick Bites</span>

//         <button
//           onClick={() => setOpen((p) => !p)}
//           className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
//           aria-label={open ? "Close menu" : "Open menu"}
//         >
//           {open ? (
//             /* X */
//             <svg
//               className="w-6 h-6"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           ) : (
//             /* Hamburger */
//             <svg
//               className="w-6 h-6"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           )}
//         </button>
//       </div>

//       {/* Sidebar element:
//           - fixed & slide-over on mobile (translate-x)
//           - static / in-flow on md+ (md:static) so a left margin on main will make content side-by-side
//       */}
//       <aside
//         className={`bg-white border-r-2 border-gray-200 h-screen w-64 shadow-md
//           fixed md:static top-0 left-0 z-40
//           transform transition-transform duration-300
//           ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
//         `}
//       >
//         <div className="p-6 h-full flex flex-col">
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             Quick Bites
//           </h2>
//           <p className="text-sm text-gray-500 mb-6">Admin Controls</p>

//           <nav className="flex flex-col gap-3">
//             {navItems.map((item) => (
//               <NavLink
//                 key={item.name}
//                 to={item.drivesto}
//                 onClick={() => setOpen(false)} // close the mobile menu after navigation
//                 className={({ isActive }) =>
//                   `flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm border shadow-sm transition
//                     ${
//                       isActive
//                         ? "bg-red-500 text-white border-red-600 shadow-md"
//                         : "bg-white text-gray-700 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
//                     }`
//                 }
//               >
//                 <span className="text-lg">{item.icon}</span>
//                 {item.name}
//               </NavLink>
//             ))}
//           </nav>
//         </div>
//       </aside>
//     </>
//   );
// }

// Usage guideline: Paste this file into your React project and import <Sidebar /> in your layout. It is fully Tailwind CSS — no external CSS needed.

import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ onSelect }) {
  const [active, setActive] = useState("list");

  const [open, setOpen] = useState(false); // mobile

  const items = [
    { id: "add", label: "Add Items", emoji: "➕", driveto: "/add" },
    { id: "list", label: "List Items", emoji: "📋", driveto: "/list" },
    { id: "orders", label: "Orders", emoji: "🧾", driveto: "/orders" },
  ];

  const handleSelect = (id) => {
    setActive(id);
    if (onSelect) onSelect(id);
    setOpen(false); // close mobile drawer on select
  };

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle sidebar"
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <span className="text-2xl">☰</span>
          </button>
          <div className="text-lg font-semibold">Quick Bites Admin</div>
        </div>
      </div>

      {/* Sidebar for medium+ screens */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:h-screen md:sticky md:top-0 bg-white border-r border-gray-200">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-gray-100">
          <div className="text-2xl">🍔</div>
          <div>
            <h2 className="text-lg font-semibold">Quick Bites</h2>
            <p className="text-sm text-gray-500">Admin panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {items.map((it) => (
              <NavLink key={it.id} to={it.driveto}>
                <li>
                  <button
                    onClick={() => handleSelect(it.id)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-300
                    ${
                      active === it.id
                        ? "bg-amber-50 text-amber-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    aria-current={active === it.id ? "page" : undefined}
                  >
                    <span className="text-xl">{it.emoji}</span>
                    <span className="flex-1">{it.label}</span>
                    {active === it.id && (
                      <span className="text-sm text-amber-500">●</span>
                    )}
                  </button>
                </li>
              </NavLink>
            ))}
          </ul>
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <button
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-amber-50 text-amber-700 font-medium hover:bg-amber-100"
            onClick={() => alert("Signing out (demo)")}
          >
            <span>🔒</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile drawer (slide over) */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div className="relative w-64 bg-white shadow-xl h-full overflow-y-auto">
            <div className="px-4 py-5 flex items-center gap-3 border-b border-gray-100">
              <div className="text-2xl">🍔</div>
              <div>
                <h3 className="text-base font-semibold">Quick Bites</h3>
                <p className="text-sm text-gray-500">Admin</p>
              </div>
            </div>

            <nav className="px-3 py-4">
              <ul className="space-y-2">
                {items.map((it) => (
                  <li key={it.id}>
                    <button
                      onClick={() => handleSelect(it.id)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-300
                        ${
                          active === it.id
                            ? "bg-amber-50 text-amber-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <span className="text-xl">{it.emoji}</span>
                      <span className="flex-1">{it.label}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <button
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-amber-50 text-amber-700 font-medium hover:bg-amber-100"
                  onClick={() => alert("Signing out (demo)")}
                >
                  <span>🔒</span>
                  <span>Sign out</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
