import { collection, getDocs, getDoc, doc, query, where, addDoc, deleteDoc, setDoc, serverTimestamp, writeBatch, orderBy } from 'firebase/firestore';
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

export const getTrendyProducts = async (limitCount = 8) => {
  try {
    // In a real app, you might have a 'trendy' or 'featured' field
    // For now, we'll fetch the latest products as 'trendy'
    const q = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc'),
      // limit(limitCount) // Note: limit needs to be imported if used
    );
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return products.slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching trendy products: ", error);
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

export const updateProductStock = async (productId, newStock) => {
  try {
    const productRef = doc(db, 'products', productId);
    await setDoc(productRef, { stock: newStock }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating product stock: ", error);
    return { success: false, error };
  }
};

export const decrementStock = async (productId, quantity) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const currentStock = productSnap.data().stock || 0;
      const updatedStock = Math.max(0, currentStock - quantity);
      await setDoc(productRef, { stock: updatedStock }, { merge: true });
      return { success: true, updatedStock };
    }
    return { success: false, error: "Product not found" };
  } catch (error) {
    console.error("Error decrementing stock: ", error);
    return { success: false, error };
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

export const toggleWishlist = async (userId, productId) => {
  try {
    const q = query(
      collection(db, 'wishlist'),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Remove if exists
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, 'wishlist', docId));
      return { action: 'removed', success: true };
    } else {
      // Add if doesn't exist
      await addDoc(collection(db, 'wishlist'), {
        userId,
        productId,
        createdAt: serverTimestamp()
      });
      return { action: 'added', success: true };
    }
  } catch (error) {
    console.error("Error toggling wishlist: ", error);
    return { success: false, error };
  }
};

export const getWishlist = async (userId) => {
  try {
    const q = query(collection(db, 'wishlist'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().productId);
  } catch (error) {
    console.error("Error fetching wishlist: ", error);
    return [];
  }
};

export const addProductReview = async (productId, reviewData) => {
  try {
    const reviewRef = collection(db, 'products', productId, 'reviews');
    await addDoc(reviewRef, {
      ...reviewData,
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error adding review: ", error);
    return { success: false, error };
  }
};

export const getProductReviews = async (productId) => {
  try {
    const reviewRef = collection(db, 'products', productId, 'reviews');
    const q = query(reviewRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching reviews: ", error);
    return [];
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, data, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating profile: ", error);
    return { success: false, error };
  }
};

export const addUserAddress = async (userId, addressData) => {
  try {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    const docRef = await addDoc(addressesRef, {
      ...addressData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Error adding address: ", error);
    return { success: false, error };
  }
};

export const getUserAddresses = async (userId) => {
  try {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    const q = query(addressesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching addresses: ", error);
    return [];
  }
};

export const updateUserAddress = async (userId, addressId, data) => {
  try {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await setDoc(addressRef, data, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating address: ", error);
    return { success: false, error };
  }
};

export const deleteUserAddress = async (userId, addressId) => {
  try {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await deleteDoc(addressRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting address: ", error);
    return { success: false, error };
  }
};

export const getCoupon = async (code) => {
  try {
    const q = query(collection(db, 'coupons'), where('code', '==', code.toUpperCase()));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching coupon: ", error);
    return null;
  }
};
