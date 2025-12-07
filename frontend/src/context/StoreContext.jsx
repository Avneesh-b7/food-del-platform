import { useContext, createContext, useState, useEffect } from "react";
import { fooditems_list } from "../assets/assets.js";

//create store context (the box)
const StoreContext = createContext(null);

//create a provider for this context which is like a wrapper over this context
function StoreContextProvider(props) {
  // cartItems will look like: { "1": 2, "5": 1 }  (itemId: quantity)
  const [cartItems, setCartItems] = useState({});

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

  const contextValue = {
    // provide values that you need to access
    fooditems_list,
    addToCart,
    removeFromCart,
    getItemCount,
    cartItems,
    setCartItems,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
}

export { StoreContext, StoreContextProvider };
