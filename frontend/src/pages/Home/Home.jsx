import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu.jsx";
import { FoodItemDisplay } from "../../components/FoodItemDisplay/FoodItemDisplay.jsx";
import { StoreContext } from "../../context/StoreContext.jsx";

function Home() {
  const [catg, setCatg] = useState("all");
  const { cartItems, setCartItems } = useContext(StoreContext);

  useEffect(() => {
    const totalCount = Object.values(cartItems).reduce(
      (sum, value) => sum + value,
      0
    );
  }, [cartItems]);

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
