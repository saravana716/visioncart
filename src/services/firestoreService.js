import { collection, getDocs, getDoc, doc, query, where, addDoc, deleteDoc, serverTimestamp, writeBatch, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching categories: ", error);
    return [];
  }
};

export const getProducts = async (categoryName = null, filters = {}, sortBy = 'latest') => {
  try {
    let q = query(collection(db, 'products'));
    
    if (categoryName) {
      q = query(q, where('category', '==', categoryName));
    }

    // Apply additional filters dynamically
    Object.keys(filters).forEach(key => {
      const val = filters[key];
      if (val) {
        if (key === 'priceRange' && Array.isArray(val) && val.length > 0) {
            // Price filtering is best handled by creating a compound condition or local filtering
            // For simplicity and correctness with multiple ranges, we'll map them
            // Note: Firestore doesn't support multiple range inequalities on different values well, 
            // but we can handle 'in' for discrete fields or just filter the price field.
        } else if (Array.isArray(val) && val.length > 0) {
          q = query(q, where(key, 'in', val));
        } else if (typeof val === 'string') {
          q = query(q, where(key, '==', val));
        }
      }
    });

    const querySnapshot = await getDocs(q);
    let products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Post-process Price Range Filter (since Firestore inequality limits)
    if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length > 0) {
        products = products.filter(p => {
            const price = parseInt(p.price?.toString().replace(/[^0-9]/g, '') || '0');
            return filters.priceRange.some(range => {
                if (range === 'under500') return price < 500;
                if (range === '500-1000') return price >= 500 && price <= 1000;
                if (range === '1000-2000') return price > 1000 && price <= 2000;
                if (range === 'over2000') return price > 2000;
                return true;
            });
        });
    }

    // Apply Sorting
    if (sortBy === 'lowToHigh') {
        products.sort((a, b) => {
            const priceA = parseInt(a.price?.toString().replace(/[^0-9]/g, '') || '0');
            const priceB = parseInt(b.price?.toString().replace(/[^0-9]/g, '') || '0');
            return priceA - priceB;
        });
    } else if (sortBy === 'highToLow') {
        products.sort((a, b) => {
            const priceA = parseInt(a.price?.toString().replace(/[^0-9]/g, '') || '0');
            const priceB = parseInt(b.price?.toString().replace(/[^0-9]/g, '') || '0');
            return priceB - priceA;
        });
    }

    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, 'products', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching product by ID: ", error);
    return null;
  }
};

export const getCategoryByName = async (name) => {
  try {
    const q = query(collection(db, 'categories'), where('name', '==', name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching category by name: ", error);
    return null;
  }
};
export const getLensEnhancements = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'lensEnhancements'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Error fetching lens enhancements: ", error);
    return [];
  }
};

export const addToCart = async (userId, cartData) => {
  try {
    const cartRef = collection(db, 'carts');
    const docRef = await addDoc(cartRef, {
      userId,
      ...cartData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Error adding to cart: ", error);
    return { success: false, error };
  }
};

export const getCartItems = async (userId) => {
  try {
    const q = query(collection(db, 'carts'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching cart items: ", error);
    return [];
  }
};

export const removeFromCart = async (cartItemId) => {
  try {
    await deleteDoc(doc(db, 'carts', cartItemId));
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart: ", error);
    return { success: false, error };
  }
};

export const placeOrder = async (userId, orderData) => {
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      userId,
      ...orderData,
      status: 'Ordered',
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Error placing order: ", error);
    return { success: false, error };
  }
};

export const clearUserCart = async (userId) => {
  try {
    const q = query(collection(db, 'carts'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart: ", error);
    return { success: false, error };
  }
};

export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, 'orders'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort in JS to avoid requiring a composite index
    return orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching user orders: ", error);
    return [];
  }
};
