import React, { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu.jsx";
import { FoodItemDisplay } from "../../components/FoodItemDisplay/FoodItemDisplay.jsx";

function Home() {
  const [catg, setCatg] = useState("all");

  return (
    <>
      {/* <h1>this is home page</h1> */}
      <Navbar />
      <Header />
      <ExploreMenu category={catg} setCategory={setCatg} />
      <FoodItemDisplay category={catg} setCategory={setCatg} />
    </>
  );
}

export default Home;
