import { ClientRequest, AppPreferences } from '../types';
import { PATTERNS } from '../constants';

export const getFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem('babil_favorites');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error reading favorites", e);
    return [];
  }
};

export const toggleFavorite = (productId: string): string[] => {
  try {
    const favorites = getFavorites();
    let newFavorites;
    if (favorites.includes(productId)) {
      newFavorites = favorites.filter(id => id !== productId);
    } else {
      newFavorites = [...favorites, productId];
    }
    localStorage.setItem('babil_favorites', JSON.stringify(newFavorites));
    return newFavorites;
  } catch (e) {
    console.error("Error saving favorites", e);
    return [];
  }
};

export const isFavorite = (productId: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(productId);
};

// --- Client Requests Storage ---

export const getRequests = (): ClientRequest[] => {
  try {
    const stored = localStorage.getItem('babil_requests');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error reading requests", e);
    return [];
  }
};

export const saveRequest = (request: ClientRequest): ClientRequest[] => {
  try {
    const requests = getRequests();
    // Add new request to the beginning of the array
    const newRequests = [request, ...requests];
    localStorage.setItem('babil_requests', JSON.stringify(newRequests));
    return newRequests;
  } catch (e) {
    console.error("Error saving request", e);
    return [];
  }
};

export const deleteRequest = (requestId: string): ClientRequest[] => {
  try {
    const requests = getRequests();
    const newRequests = requests.filter(r => r.id !== requestId);
    localStorage.setItem('babil_requests', JSON.stringify(newRequests));
    return newRequests;
  } catch (e) {
    console.error("Error deleting request", e);
    return [];
  }
};

// --- App Preferences (Backgrounds) ---

export const getAppPreferences = (): AppPreferences => {
  try {
    const stored = localStorage.getItem('babil_preferences');
    return stored ? JSON.parse(stored) : {
      backgroundPattern: PATTERNS[0].url,
      backgroundOpacity: 0.03
    };
  } catch (e) {
    return {
      backgroundPattern: PATTERNS[0].url,
      backgroundOpacity: 0.03
    };
  }
};

export const saveAppPreferences = (prefs: AppPreferences) => {
  try {
    localStorage.setItem('babil_preferences', JSON.stringify(prefs));
  } catch (e) {
    console.error("Error saving preferences", e);
  }
};
