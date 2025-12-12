import { useState } from "react";
import { Router, Route, Routes } from "react-router-dom";
import AddItems from "./pages/AddItems/AddItems.jsx";
import ListItems from "./pages/ListItems/ListItems.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="bg-amber-300 text-center ">welcome to admin panel </h1>
      <Navbar />
      <Routes>
        <Route path="/add" element={<AddItems />}></Route>
        <Route path="/list" element={<ListItems />}></Route>
        <Route path="/orders" element={<Orders />}></Route>
      </Routes>
    </>
  );
}

export default App;
