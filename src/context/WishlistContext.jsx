import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { getWishlist, toggleWishlist as toggleWishlistService, removeFromWishlist as removeFromWishlistService } from '../services/firestoreService';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const items = await getWishlist(currentUser.uid);
                setWishlistItems(items);
            } else {
                setWishlistItems([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error("Please login to add favorites");
            return;
        }

        const result = await toggleWishlistService(user.uid, productId);
        if (result.success) {
            if (result.action === 'added') {
                setWishlistItems(prev => [...prev, productId]);
                toast.success("Added to Wishlist", {
                    icon: '❤️',
                    style: { borderRadius: '10px', background: '#333', color: '#fff' }
                });
            } else {
                setWishlistItems(prev => prev.filter(id => id !== productId));
                toast.success("Removed from Wishlist");
            }
        }
    };

    // Silently remove stale IDs (products deleted from DB) from wishlist
    const cleanupStaleIds = async (staleIds) => {
        if (!user || !staleIds || staleIds.length === 0) return;
        // Remove each stale ID from local state silently
        setWishlistItems(prev => prev.filter(id => !staleIds.includes(id)));
        // Try to remove from Firestore too (best effort, no toast)
        for (const id of staleIds) {
            try {
                await removeFromWishlistService(user.uid, id);
            } catch (e) {
                // silent fail
            }
        }
    };

    const isInWishlist = (productId) => wishlistItems.includes(productId);

    return (
        <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, cleanupStaleIds }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
