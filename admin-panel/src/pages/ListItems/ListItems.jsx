// const ListItems = () => {
//   return (
//     <>
//       {/* <h1>this is the list items page !</h1>
//         // 1. query the list items API (http://localhost:3003/api/v1/food/list) to get a link of all items in the db (using axios)
//         // 2 . display all the items in a table format (it should look professional and clean - use tailwind css)
//         // 3 . handle errors graceully
//         // 4. keep the code readable , simple and production grade
//         // 5. give a 2 liner as to how to use this component at the top (usage guidelines)

//       */}
//     </>
//   );
// };

// USAGE: Import <ListItems /> into any page and render it directly.
// It automatically fetches items and displays them in a clean, responsive table.

// USAGE:
// <ListItems /> — Renders a table of all food items from your backend.
// Make sure your backend returns an array of items with: _id, name, category, price, imageUrl.

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_PORT } from "../../../constants.js";

export default function ListItems({ baseurl }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // track delete in progress
  const [error, setError] = useState(null);

  // USAGE: call removeItem(id, fetchItems) to delete an item and refresh UI.
  async function removeItem(id, refreshList) {
    try {
      if (!id) {
        toast.error("Invalid item ID");
        return;
      }

      setDeletingId(id); // show spinner for this row

      const res = await axios.post(baseurl + "/food/remove", { id });

      if (res.data?.success) {
        toast.success("Item removed successfully ✔️");
        if (refreshList) refreshList();
      } else {
        toast.error(res.data?.message || "Failed to remove item.");
      }
    } catch (err) {
      console.error("removeItem error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong while deleting.";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  }

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:${BACKEND_PORT}/api/v1/food/list`
      );

      if (Array.isArray(res.data.data)) {
        setItems(res.data.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Food Items</h1>

      {/* Loading Indicator */}
      {loading && (
        <p className="text-gray-500 animate-pulse">Loading items...</p>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border-b">Image</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Category</th>
                <th className="p-3 border-b">Price</th>
                <th className="p-3 border-b">Remove Item</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 p-4">
                    No items found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition border-b last:border-b-0"
                  >
                    {/* Image */}
                    <td className="p-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-12 w-12 object-cover rounded-md shadow-sm"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                    </td>

                    {/* Name */}
                    <td className="p-3">{item.name}</td>

                    {/* Category */}
                    <td className="p-3">{item.category}</td>

                    {/* Price */}
                    <td className="p-3 font-semibold">₹{item.price}</td>

                    {/* Remove Item */}
                    <td className="p-3 text-center">
                      {deletingId === item._id ? (
                        // Spinner during delete
                        <div className="h-6 w-6 border-2 border-red-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      ) : (
                        <span
                          onClick={() => removeItem(item._id, fetchItems)}
                          className="cursor-pointer text-red-500 hover:text-red-700 text-xl transition transform hover:scale-110 active:scale-90"
                        >
                          ❌
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
