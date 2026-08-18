import { initializeApp } from "firebase/app";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
} from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Firebase web API keys are public by design. In production you can override
// these values via environment variables if you prefer not to ship them.
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyAtr9kmZioKULsJ_2eqAAk24oFpW99mlwY",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "vista-de-la-rosa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vista-de-la-rosa",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "vista-de-la-rosa.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "650007399087",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:650007399087:web:eabe6313ef03869d2be25a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WKYCZ31N7T",
};

const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];
for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    // eslint-disable-next-line no-console
    console.error(`[Firebase] Missing required config: ${key}`);
  }
}

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

// Analytics is only available in the browser and may be blocked by ad blockers.
let analytics = null;
isAnalyticsSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(firebaseApp);
  }
});
export { analytics };

if (import.meta.env.VITE_FIREBASE_EMULATOR === "true") {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectStorageEmulator(storage, "localhost", 9199);
}
