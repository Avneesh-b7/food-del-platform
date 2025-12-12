import { useState } from "react";
import { Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="bg-amber-300 align-middle">welcome to admin panel </h1>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
