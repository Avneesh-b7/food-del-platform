import { useContext, createContext, useState, useEffect } from "react";
// import { fooditems_list } from "../assets/assets.js"; --- now we will fetch this from db
import axios from "axios";
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

  // PROMPT
  // help me write a loaddata function
  // i am writing this function in the store context
  // const fooditems_list = fetch this data from backend using axios (mongo db)
  // handle errors gracefully and send appropriate responses and status codes
  // the food items object in db loooks like this -- {, _id, name, image, price, description ,category}
  // we need to run this everytime the page is refreshed

  const [foodItemsList, setFoodItemsList] = useState([]);

  const loadData = async () => {
    try {
      const res = await axios.get(`${base_url}/food/list`);

      if (res.status === 200 && Array.isArray(res.data.data)) {
        setFoodItemsList(res.data.data);
      } else {
        console.warn("Unexpected API format for food items:", res.data);
        setFoodItemsList([]);
      }
    } catch (err) {
      console.error("Error fetching food items:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to load food items.";

      setFoodItemsList([]);
    }
  };

  // Run on refresh only once
  useEffect(() => {
    loadData();
  }, []);

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
  const itemsInCart = foodItemsList.filter((item) => cartItems[item._id] > 0);

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
    foodItemsList,
    setFoodItemsList,
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
