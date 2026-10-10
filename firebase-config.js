// Pegá aquí la configuración de tu proyecto Firebase.
export const firebaseConfig = {
  apiKey: "PEGAR_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.firebasestorage.app",
  messagingSenderId: "PEGAR_ID",
  appId: "PEGAR_APP_ID"
};
export const firebaseReady = !firebaseConfig.apiKey.startsWith('PEGAR_');
