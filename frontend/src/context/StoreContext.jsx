import { useContext, createContext, useState, useEffect } from "react";
// import { fooditems_list } from "../assets/assets.js"; --- now we will fetch this from db
import axios from "axios";
import { BACKEND_PORT } from "../../constants.js";
import { toast } from "react-toastify";

//create store context (the box)
const StoreContext = createContext(null);

//create a provider for this context which is like a wrapper over this context
function StoreContextProvider(props) {
  // cartItems will look like: { "1": 2, "5": 1 }  (itemId: quantity)
  const [cartItems, setCartItems] = useState({});

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleLogout = () => {
    try {
      // Remove refresh token from localStorage
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Clear React auth state
      setAccessToken("");
      setUser(null);

      setAccessToken("");
      setUser(null);
      setIsAuthenticated(false);
      setCartItems({});

      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  async function verify(token, logoutFunc) {
    try {
      const res = await axios.get(`${base_url}/auth/verify-access-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        console.info(
          "[Auth] Token valid. Restoring user:",
          res.data.user.email
        );
        console.log(res);
        setUser({ name: res.data.user.email });
        setIsAuthenticated(true);
        return;
      }
    } catch (err) {
      console.warn("[Auth] Token invalid/expired:", err?.response?.data);
      console.log(err);

      logoutFunc();
    }
  }

  const loadCartFromDB = async () => {
    try {
      if (!accessToken) {
        console.warn("[loadCartFromDB] No access token. User not logged in.");
        return;
      }

      console.info("[loadCartFromDB] Fetching cart from backend...");

      const res = await axios.get(
        `${base_url}/cart/list`,
        // {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.data.success) {
        console.warn("[loadCartFromDB] Backend failure:", res.data);
        return;
      }

      const transformed = {};

      // Convert backend cart array → frontend object
      res.data.cart.forEach((item) => {
        if (item.foodId?._id) {
          transformed[item.foodId._id] = Number(item.quantity);
        }
      });

      setCartItems(transformed);

      console.info("[loadCartFromDB] Cart updated:", transformed);
    } catch (err) {
      console.error("[loadCartFromDB] Error fetching cart:", err);

      toast.error(err?.response?.data?.message || "Failed to load cart items.");
    }
  };

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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    setAccessToken(token);
    verify(token, handleLogout);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (accessToken && isAuthenticated) {
      console.info("[StoreContext] User authenticated → Loading cart");
      loadCartFromDB();
    }
    // else {
    //   console.warn("[StoreContext] Not authenticated → Skipping cart load");
    // }
  }, [accessToken, isAuthenticated]);

  // PROMPT
  // function addToCart(id) {
  // -- takes the id and qty of the food item and adds it to the cart items list
  // -- takes the id of the food item and also sends it to the db (using axios ; uses access token
  // stored in accessToken variable )
  // -- request body format for the addtocart api which is base_url + /cart/add : { "foodId": "693bd5f9cea52d3cc5f17505","quantity":  "5" }
  // -- ensure appropriate validations
  // -- make sure to handle errors gracefully
  // -- send appropriate status codes and error & response messages
  // -- log all relevant items to make is easier to troubleshoot errors
  // -- ensure production grade code quality
  // -- add a usage guideline (not more than 2 lines on the top)
  // -- do not export the function
  // }

  async function addToCart(foodId) {
    console.info("[addToCart] Request:", { foodId });

    try {
      if (!foodId) {
        toast.error("Invalid food item.");
        return;
      }

      if (!accessToken) {
        toast.error("Please login to add items.");
        return;
      }

      // -------------------------
      // 1️⃣ Update local cart safely
      // -------------------------
      setCartItems((prev) => {
        const currentQty = Number(prev[foodId] || 0); // ⭐ numeric always
        const newQty = currentQty + 1;

        return {
          ...prev,
          [foodId]: newQty,
        };
      });

      // -------------------------
      // 2️⃣ Notify backend
      // -------------------------
      const res = await axios.post(
        `${base_url}/cart/add`,
        {
          foodId: foodId, // ObjectId string ✔
          quantity: 1, // Number ✔
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.info("[addToCart] Backend response:", res.data);

      if (res.data.success) {
        toast.success("Added to cart");
      } else {
        toast.error(res.data.message || "Failed to add item");
      }
    } catch (err) {
      console.error("[addToCart] Error:", err);

      toast.error(err?.response?.data?.message || "Error adding item to cart.");
    }
  }

  // PROMPT
  // function removefromCart(id) {
  // -- takes the id and qty of the food item and removes it from the cart items list
  // -- takes the id of the food item and also sends it to the db (using axios ; uses access token
  // stored in accessToken variable )
  // -- format for the req at url  base_url + /cart/remove : { "foodId": "693ef9810d8dc9173545de67","removeAll":  false}
  // -- ensure appropriate validations
  // -- make sure to handle errors gracefully
  // -- send appropriate status codes and error & response messages
  // -- log all relevant items to make is easier to troubleshoot errors
  // -- ensure production grade code quality
  // -- add a usage guideline (not more than 2 lines on the top)
  // -- do not export the function
  // }

  // USAGE:
  // removeFromCart(foodId, removeAll=false) → removes 1 quantity or the full item from cart.

  async function removeFromCart(foodId, removeAll = false) {
    console.info("[removeFromCart] Request received:", { foodId, removeAll });

    try {
      // ------------------------------------
      // 1️⃣ VALIDATION
      // ------------------------------------
      if (!foodId) {
        console.warn("[removeFromCart] Missing foodId");
        toast.error("Invalid food item.");
        return;
      }

      if (!accessToken) {
        console.warn("[removeFromCart] No access token");
        toast.error("Please login to update your cart.");
        return;
      }

      // ------------------------------------
      // 2️⃣ SAFE LOCAL STATE UPDATE
      // ------------------------------------
      setCartItems((prev) => {
        const currentQty = Number(prev[foodId] || 0);
        console.info("[removeFromCart] Current quantity:", currentQty);

        if (currentQty <= 0) {
          console.warn("[removeFromCart] Item not in cart:", foodId);
          return prev;
        }

        // Otherwise remove ONE quantity
        const updatedQty = currentQty - 1;

        console.info("[removeFromCart] Reduced frontend quantity:", {
          foodId,
          from: currentQty,
          to: updatedQty,
        });

        return {
          ...prev,
          [foodId]: updatedQty,
        };
      });

      // ------------------------------------
      // 3️⃣ SYNC WITH BACKEND
      // ------------------------------------
      const res = await axios.post(
        `${base_url}/cart/remove`,
        {
          foodId,
          removeAll,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.info("[removeFromCart] Backend response:", res.data);

      if (res.data.success) {
        if (removeAll) {
          toast.success("Item removed from cart");
        } else {
          toast.success("Item quantity updated");
        }
      } else {
        toast.error(res.data.message || "Failed to update cart");
      }
    } catch (err) {
      console.error("[removeFromCart] Error:", err);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while updating cart.";

      toast.error(msg);
    }
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
    loadCartFromDB,
    verify,
    handleLogout,
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
}

export { StoreContext, StoreContextProvider };
