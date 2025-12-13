//PROMPT
// const AddItems = () => {
//   return (
//     <>
//       <h1>this is the add items page !</h1>
//      // 1. i want to align everything to the center of the page
// 2. i want to add an upload image option on the page the first thing
// 3. i want to also add an option for the user to enter the food name
// 4. then the user should be able to add the food description
// 4. then the user should be able to add the food category (* note vategory can only be one of the following -->)
// 5. then the user should be able to add the food Price (onnly between 20- 20000 rupees)
// 6.then there is an Add button at the end of the page
//7. make it look professional and clean
//8. use tailwind css to make it look professional and clean
// 9. give a usage guideline (not more than 2 lines on the top of your output as a comment)
// remember everything is aligned in the center of the page
//     </>
//   );
// };

// Usage guideline: Drop this file into your React project and render <AddItems onSubmit={fn} menu_list={menu_list} />. Provide `menu_list` (array of {name,img}) from your app; the component falls back to built-in names if not provided.
// Usage guideline: Paste this file into your React project and render <AddItems />. Everything is Tailwind-only and centered as requested.

import React, { useState, useRef } from "react";
import axios from "axios";

export default function AddItems({ baseurl }) {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // categories
  const menu_list = [
    { name: "Desserts" },
    { name: "Appetizers" },
    { name: "Cocktails" },
    { name: "Main Course" },
    { name: "Mocktails" },
    { name: "Salads" },
  ];

  const categories = menu_list.map((m) => m.name);

  const resetForm = () => {
    setImage(null);
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const validate = () => {
    const e = {};
    if (!image) e.image = "Please upload an image.";
    if (!name.trim()) e.name = "Food name is required.";
    if (!description.trim()) e.description = "Description is required.";
    if (!category) e.category = "Choose a category.";
    const p = Number(price);
    if (!price) e.price = "Price is required.";
    else if (Number.isNaN(p)) e.price = "Price must be a number.";
    else if (p < 20 || p > 20000)
      e.price = "Price must be between ₹20 and ₹20,000.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "File must be an image." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  // PROMPT
  // # next steps
  // 1. i want to send the response to my backend API which helps me add food
  // 2. the API endpoint is - https://localhost:{backend_port}/api/v1/food/add
  // 3. i am using axios (https://axios-http.com/docs/intro)
  // 4. complete the Handle Submit function and help me push the payload to the backend api end point
  // #context
  // herre is the handle submit function --> passed on the function

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("Please choose an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("price", String(price));

    try {
      setSubmitting(true);

      const url = baseurl + "/food/add";

      const response = await axios.post(url, formData, {
        headers: {
          // DO NOT set Content-Type → axios will set it correctly.
        },
        timeout: 15000, // normal safe timeout
      });

      alert("Item added successfully");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-xl shadow p-8"
      >
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-2">Add New Food Item</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Upload image first, then fill name, description, category and price.
          </p>

          {/* Image upload */}
          <div className="w-full flex flex-col items-center">
            <div className="w-40 h-40 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-dashed border-gray-200">
              {image ? (
                <img
                  src={image}
                  alt="preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-center px-4">
                  <div className="text-3xl">📷</div>
                  <div className="text-sm text-gray-500">
                    Upload image (jpeg, png)
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer text-sm font-medium"
              >
                Choose Image
              </label>
              {image && (
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = null;
                  }}
                  className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            {errors.image && (
              <p className="text-xs text-red-600 mt-2">{errors.image}</p>
            )}
          </div>

          {/* Name */}
          <div className="w-full mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                errors.name ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="e.g. Classic Paneer Burger"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="w-full mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                errors.description ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="Short description of the dish"
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category + Price */}
          <div className="w-full mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                  errors.category ? "border-red-300" : "border-gray-200"
                }`}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-600 mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                step="1"
                min="20"
                max="20000"
                className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                  errors.price ? "border-red-300" : "border-gray-200"
                }`}
                placeholder="Enter price in rupees"
              />
              {errors.price && (
                <p className="text-xs text-red-600 mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Add button */}
          <div className="w-full mt-6">
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm transition"
            >
              ➕ Add Item
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
