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
    } else {
      prevCart.push(id);
      setCartItems(prevCart);
      localStorage.setItem("RefundcartItems", JSON.stringify(prevCart));
    }
  }

  function removeFromCart(id) {
    let prevCart = [...cartItems];

    const index = prevCart.indexOf(id);

    prevCart.splice(index, 1);
    setCartItems(prevCart);
    localStorage.setItem("RefundcartItems", JSON.stringify(prevCart));
  }

  return (
    <CartContext.Provider
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
