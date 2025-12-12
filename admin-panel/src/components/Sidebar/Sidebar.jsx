import { React, useState } from "react";

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

function Sidebar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Add Items", icon: "🍽️" },
    { name: "List Items", icon: "📋" },
    { name: "Orders", icon: "🛒" },
  ];

  return (
    <div>
      {/* Mobile toggle */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 border-b bg-white">
        <span className="font-semibold text-gray-800 text-lg">Menu</span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white border-r-2 border-gray-200 h-screen md:h-screen md:static fixed left-0 top-0 z-40 w-64 transform transition-transform duration-300 md:translate-x-0 shadow-md ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 h-full flex flex-col justify-start">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Quick Bites
          </h2>
          <p className="text-sm text-gray-500 mb-6">Admin Controls</p>

          <nav className="flex flex-col gap-3 flex-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                className="flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium text-sm shadow-sm border bg-white text-gray-700 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                onClick={() => console.log(`Selected: ${item.name}`)}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
