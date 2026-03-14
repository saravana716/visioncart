import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { addToCart, getCartItems, removeFromCart } from '../services/firestoreService';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('cart');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCartItems(currentUser.uid);
      } else {
        setCartItems([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchCartItems = async (userId) => {
    setLoading(true);
    const items = await getCartItems(userId);
    setCartItems(items);
    setLoading(false);
  };

  const addItemToCart = async (productData) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return false;
    }

    const result = await addToCart(user.uid, productData);
    if (result.success) {
      setCartItems(prev => [...prev, { id: result.id, userId: user.uid, ...productData }]);
      toast.success("Added to cart successfully!");
      return true;
    } else {
      toast.error("Failed to add to cart");
      return false;
    }
  };

  const removeItemFromCart = async (cartItemId) => {
    const result = await removeFromCart(cartItemId);
    if (result.success) {
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      toast.success("Removed from cart");
    } else {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = () => {
    // This would ideally clear all items from Firestore too
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addItemToCart,
      removeItemFromCart,
      clearCart,
      cartOpen,
      setCartOpen,
      drawerTab,
      setDrawerTab,
      cartCount: cartItems.length
    }}>
      {children}
    </CartContext.Provider>
  );
};
