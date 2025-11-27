import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- TUS CREDENCIALES DE FIREBASE (TECPASS) ---
const firebaseConfig = {
  apiKey: "AIzaSyAlKki-Ep2ToyZYVTCZCoQmPdgzR_KgxDI",
  authDomain: "tecpass-28981.firebaseapp.com",
  projectId: "tecpass-28981",
  storageBucket: "tecpass-28981.firebasestorage.app",
  messagingSenderId: "906889737170",
  appId: "1:906889737170:web:488a5df37442d5561bce0b"
};

// Inicialización de los servicios
let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase conectado exitosamente ✅");
} catch (error) {
  console.error("Error inicializando Firebase:", error);
}

// Exportamos 'auth' y 'db' para usarlos en el resto de la app
export { auth, db };