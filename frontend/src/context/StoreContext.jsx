import { useContext, createContext } from "react";
import { fooditems_list } from "../assets/assets.js";

//create store context (the box)
const StoreContext = createContext(null);

//create a provider for this context which is like a wrapper over this context
function StoreContextProvider(props) {
  const contextValue = {
    // provide values that you need to access
    fooditems_list,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
}

export { StoreContext, StoreContextProvider };
