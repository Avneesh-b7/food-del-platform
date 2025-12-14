import { useContext, createContext, useState, useEffect } from "react";
import { fooditems_list } from "../assets/assets.js";
import { BACKEND_PORT } from "../../constants.js";

//create store context (the box)
const StoreContext = createContext(null);

//create a provider for this context which is like a wrapper over this context
function StoreContextProvider(props) {
  // cartItems will look like: { "1": 2, "5": 1 }  (itemId: quantity)
  const [cartItems, setCartItems] = useState({});

  const [user, setUser] = useState(null);

  const [accessToken, setAccessToken] = useState("");

  const base_url = `http://localhost:${BACKEND_PORT}/api/v1`;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedUserName = localStorage.getItem("user");

    if (token && savedUserName) {
      setAccessToken(token);
      setUser({ name: savedUserName });
    }
  }, []);

  function addToCart(id) {
    const updatedCart = { ...cartItems };
    updatedCart[id] = (updatedCart[id] || 0) + 1;
    setCartItems(updatedCart);
  }

  function removeFromCart(id) {
    setCartItems((prev) => {
      const updated = Object.assign({}, prev);

      if (!updated[id]) return prev;

      if (updated[id] == 1) {
        delete updated[id];
      } else {
        updated[id] = updated[id] - 1;
      }

      return updated;
    });
  }

  function getItemCount(id) {
    return cartItems[id] || 0;
  }

  // useEffect(() => {
  //   console.log(cartItems);
  // }, [cartItems]);
  // Get full objects for items present in cart
  const itemsInCart = fooditems_list.filter((item) => cartItems[item._id] > 0);

  // Compute total bill
  const totalAmount = itemsInCart.reduce((sum, item) => {
    return sum + item.price * cartItems[item._id];
  }, 0);

  function deleteItem(id) {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  }

  const deliveryFee = totalAmount >= 1000 ? 0 : 50;
  const contextValue = {
    // provide values that you need to access
    fooditems_list,
    addToCart,
    removeFromCart,
    getItemCount,
    cartItems,
    setCartItems,
    totalAmount,
    itemsInCart,
    deleteItem,
    deliveryFee,
    base_url,
    user,
    setUser,
    accessToken,
    setAccessToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
}

export { StoreContext, StoreContextProvider };
