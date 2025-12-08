import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-20" id="footer-id">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">
        {/* Brand Section */}
        <div className="max-w-xs">
          <h2 className="text-2xl font-bold text-white">QuickBites</h2>
          <p className="text-sm mt-3 text-gray-400">
            QuickBites brings delicious meals to your doorstep with a fast,
            reliable delivery experience. Discover top-rated restaurants and
            enjoy food from the comfort of your home.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-red-400 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-400 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-400 transition">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-400 transition">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-red-400 transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-xs text-gray-500">
        {new Date().getFullYear()} QuickBites (only for learning purposes)
      </div>
    </footer>
  );
}

export { Footer };
