import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import { Cart } from "./pages/Cart/Cart.jsx";
import { PlaceOrder } from "./pages/PlaceOrder/PlaceOrder.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import { SignUpPopup } from "./components/SLPopup/SignUpPopup.jsx";
import { LoginPopup } from "./components/SLPopup/LoginPopup.jsx";
import { ToastContainer } from "react-toastify";
import { OrderSuccess } from "./pages/OrderSuccess/OrderSuccess.jsx";
import { ListOrders } from "./pages/ListOrders/ListOrders.jsx";

function App() {
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
    <>
      <ToastContainer position="top-right" autoClose={1200} />
      {showLoginPopup ? (
        <LoginPopup
          showLogin={setShowLoginPopup}
          showSignUp={setShowSignUpPopup}
        />
      ) : (
        <></>
      )}
      {showSignUpPopup ? (
        <SignUpPopup
          showLogin={setShowLoginPopup}
          showSignUp={setShowSignUpPopup}
        />
      ) : (
        <></>
      )}
      <div className="app">
        <Navbar showLogin={setShowLoginPopup} showSignUp={setShowSignUpPopup} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/orders/success/:orderId" element={<OrderSuccess />} />
          <Route path="/orders/myorders" element={<ListOrders />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
