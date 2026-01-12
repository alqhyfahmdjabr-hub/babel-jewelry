import { db } from '../firebase-config';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Product, GoldPrice } from '../types';
import { PRODUCTS as MOCK_PRODUCTS, MOCK_PRICES } from '../constants';
const isBrowser = typeof window !== 'undefined';

const COLLECTION_PRODUCTS = 'products';
const COLLECTION_SETTINGS = 'settings';
const DOC_PRICES = 'gold_prices';

// Helper to check if DB is truly ready (has config)
const isDbReady = () => {
  return db !== null;
};

// --- Shared Data (Database) ---

export const api = {
  // --- Products ---
  
  async getProducts(): Promise<Product[]> {
    if (!isDbReady()) {
       if (isBrowser) {
      // Fallback to LocalStorage
      const local = localStorage.getItem('babil_products');
      return local ? JSON.parse(local) : MOCK_PRODUCTS;
    }
    return MOCK_PRODUCTS;
  }    
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_PRODUCTS));
      if (querySnapshot.empty) {
        // If DB is empty, return mocks but don't save to DB automatically to avoid permission errors on read-only
        return MOCK_PRODUCTS;
      }
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      console.warn("Using offline mode for products due to connection issue.");
      const local = localStorage.getItem('babil_products');
      return local ? JSON.parse(local) : MOCK_PRODUCTS;
    }
  },

  async saveProduct(product: Product): Promise<void> {
   if (!isDbReady()) {
     if (isBrowser) {
       const current = await api.getProducts();
       const index = current.findIndex(p => p.id === product.id);
       const updated =
         index >= 0
           ? current.map(p => (p.id === product.id ? product : p))
           : [...current, product];

       localStorage.setItem('babil_products', JSON.stringify(updated));
     }
     return;
   }


    // Firebase Save
    try {
      await setDoc(doc(db, COLLECTION_PRODUCTS, product.id), product);
    } catch (error) {
      console.error("DB Error saving product:", error);
      // Fallback to local if DB fails
      const current = await api.getProducts();
      const index = current.findIndex(p => p.id === product.id);
      let updated;
      if (index >= 0) {
        updated = [...current];
        updated[index] = product;
      } else {
        updated = [...current, product];
      }
      localStorage.setItem('babil_products', JSON.stringify(updated));
      throw new Error("Could not save to online database, saved locally instead.");
    }
  },

  async deleteProduct(id: string): Promise<void> {
    if (!isDbReady()) {
      if (isBrowser) {
       const current = await api.getProducts();
       const updated = current.filter(p => p.id !== id);
       localStorage.setItem('babil_products', JSON.stringify(updated));
      } 
      return;
    }

    try {
      await deleteDoc(doc(db, COLLECTION_PRODUCTS, id));
    } catch (error) {
      console.error("DB Error deleting product:", error);
       // Fallback local delete
       const current = await api.getProducts();
       const updated = current.filter(p => p.id !== id);
       localStorage.setItem('babil_products', JSON.stringify(updated));
    }
  },

  // --- Prices ---

  async getPrices(): Promise<GoldPrice[]> {
    if (!isDbReady()) {
      if (isBrowser) {
      const local = localStorage.getItem('babil_prices');
      return local ? JSON.parse(local) : MOCK_PRICES;
    }
    return MOCK_PRICES;
   }
    try {
      const docRef = doc(db, COLLECTION_SETTINGS, DOC_PRICES);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().values as GoldPrice[];
      } else {
        return MOCK_PRICES;
      }
    } catch (error) {
      console.warn("Using offline mode for prices.");
      const local = localStorage.getItem('babil_prices');
      return local ? JSON.parse(local) : MOCK_PRICES;
    }
  },

  async updatePrices(prices: GoldPrice[]): Promise<void> {
    if (!isDbReady()) {
      if (isBrowser) {
      localStorage.setItem('babil_prices', JSON.stringify(prices));
      return;
    }
      return;
   }
    
    try {
      await setDoc(doc(db, COLLECTION_SETTINGS, DOC_PRICES), { values: prices });
    } catch (error) {
      console.error("DB Error saving prices:", error);
      // Fallback
      localStorage.setItem('babil_prices', JSON.stringify(prices));
      throw new Error("Saved locally only (Offline Mode).");
    }
  }
};
