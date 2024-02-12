import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
// import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [allProduct, setAllProduct] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/allproducts")
      .then((response) => response.json())
      .then((data) => {
        setAllProduct(data);
      });
    if (localStorage.getItem("token")) {
      fetch("http://localhost:4000/getcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          token: `${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          // console.log(data);
          setCartItems(data);
        });
    }
  }, []);

  const addToCart = (itemId) => {
    try {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      if (localStorage.getItem("token")) {
        fetch("http://localhost:4000/addtocart", {
          method: "POST",
          headers: {
            Accept: "application/json",
            token: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId: itemId }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Server error: ${response.statusText}`);
            }
            return response.json();
          })
          .then((data) => {
            // console.log(data);
            toast.success("Product added to cart");
          })
          .catch((error) => {
            toast.error("Error, Product not added");
            console.error("An error occurred during addToCart:", error.message);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    try {
      if (localStorage.getItem("token")) {
        fetch("http://localhost:4000/removefromcart", {
          method: "POST",
          headers: {
            Accept: "application/json",
            token: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId: itemId }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Server error: ${response.statusText}`);
            }
            return response.json();
          })
          .then((data) => {
            // console.log(data);
            toast.success("Product removed");
          })
          .catch((error) => {
            toast.error("Not removed");
            console.error(
              "An error occurred during remove from cart:",
              error.message
            );
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalCartAmount = () => {
    try {
      let totalAmount = 0;
      for (const item in cartItems) {
        if (cartItems[item] > 0) {
          let itemInfo = allProduct.find(
            (product) => product.id.toString() === item
          );
          try {
            if (itemInfo && itemInfo.new_price !== undefined) {
              totalAmount += itemInfo.new_price * cartItems[item];
            }
          } catch (error) {
            console.log(error);
          }
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
      console.log(totalAmount);
      return totalAmount;
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalCartItems = () => {
    let totalItem = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    allProduct,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
