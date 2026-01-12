export interface Product {
  id: string;
  name: string;
  category: 'necklace' | 'ring' | 'bracelet' | 'set' | 'earring';
  weight: number; // in grams
  priceEstimate: number; // calculated roughly
  imageUrl: string;
  description: string;
  karat: 18 | 21 | 24;
}

export interface GoldPrice {
  karat: 18 | 21 | 24;
  buy: number;
  sell: number;
}

export interface ContactInfo {
  manager: string;
  workers: string[];
  landlines: string[];
  designer: {
    name: string;
    phone: string;
  };
}

export interface ClientRequest {
  id: string;
  type: 'custom' | 'repair' | 'exchange' | 'preorder'; // تفصيل، صيانة، استبدال، حجز مسبق
  category: string;
  weightApprox: number;
  karat: 18 | 21 | 24;
  notes: string;
  date: string;
  status: 'pending' | 'sent';
}

export interface Pattern {
  id: string;
  name: string;
  url: string;
}

export interface AppPreferences {
  backgroundPattern: string;
  backgroundOpacity: number;
}

export type ViewState = 'home' | 'catalog' | 'favorites' | 'requests' | 'contact';