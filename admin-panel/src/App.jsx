import { useState } from "react";
import { Router, Route, Routes } from "react-router-dom";
import AddItems from "./pages/AddItems/AddItems.jsx";
import ListItems from "./pages/ListItems/ListItems.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { URL } from "../constants.js";

function App() {
  const url = URL;
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <h1 className="bg-amber-300 text-center ">welcome to admin panel </h1>
      <Navbar />
      <Routes>
        <Route path="/add" element={<AddItems baseurl={url} />}></Route>
        <Route path="/list" element={<ListItems baseurl={url} />}></Route>
        <Route path="/orders" element={<Orders baseurl={url} />}></Route>
      </Routes>
    </>
  );
}

export default App;
