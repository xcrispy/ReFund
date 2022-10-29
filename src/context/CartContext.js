import { createContext, useContext, useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Moralis from "moralis-v1";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [donationAddress, setDonationAddress] = useState([]);

  const initialState = Array.from(
    { length: JSON.parse(localStorage.getItem("RefundcartItems"))?.length },
    (_, i) => ({
      id: nanoid(),
      value: i,
    })
  );

  useEffect(() => {
    const cartItemsData = JSON.parse(localStorage.getItem("RefundcartItems"));
    if (cartItemsData) {
      setCartItems(cartItemsData);
    }
  }, []);

  function addToCart(id) {
    let prevCart = [...cartItems];
    if (prevCart.includes(id)) {
      removeFromCart(id);

      // console.log("remove index");
    } else {
      //  console.log("add index");
      prevCart.push(id);
      setCartItems(prevCart);
      localStorage.setItem("RefundcartItems", JSON.stringify(prevCart));
    }
  }

  function removeFromCart(id) {
    //  setCartItems((prevItems) => prevItems.filter((item) => item !== id));
    let prevCart = [...cartItems];

    const index = prevCart.indexOf(id);

    const sliceValue = prevCart.splice(index, 1);
    setCartItems(prevCart);
    localStorage.setItem("RefundcartItems", JSON.stringify(prevCart));
  }
  /*
  function getItemQuantity(id) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }
  function addItem(id) {
    console.log("consolelogginf");
    setCartItems((currentItems) => {
      if (currentItems.find((item) => item.id === id) === null) {
        console.log(cartItems);
        return [...currentItems, { id, quantity: 1 }];
      } else {
        console.log(currentItems);
        return currentItems.map((item) => {
          if (item.id === id && item.quantity === 0) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function removeItem(id) {
    setCartItems((currentItems) => {
      if (currentItems.find((item) => item.id === id)?.quantity === 1) {
        return currentItems.filter((item) => item.id !== id);
      } else {
        return currentItems.map((item) => {
          if (item.id === id && item.quantity === 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function removeItemFromCart(id) {
    setCartItems((currentItems) => {
      console.log(cartItems);
      return currentItems.filter((item) => item.id !== id);
    });
    console.log(cartItems);
  }*/

  return (
    <CartContext.Provider
      // value={{ getItemQuantity, addItem, removeItem, removeItemFromCart }}
      value={{
        addToCart,
        removeFromCart,
        cartItems,
        initialState,
        donationAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
