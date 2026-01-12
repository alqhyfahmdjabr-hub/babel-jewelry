import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: استبدل القيم التالية بإعدادات مشروعك من Firebase Console
// 1. اذهب إلى console.firebase.google.com
// 2. أنشئ مشروعاً جديداً
// 3. أضف تطبيق Web وانسخ الإعدادات
// 4. تأكد من تفعيل Firestore Database وتعديل القواعد (Rules) للسماح بالقراءة/الكتابة
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase only if config is valid to avoid crashing the demo
let db: any = null;

try {
  // Check if config is still default placeholder
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase connected successfully");
  } else {
    console.warn("Firebase config is missing. App running in LocalStorage mode.");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { db };