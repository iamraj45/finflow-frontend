import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCABIJ5WznJSKL7GkWA6WMY8Chw6InzbAk",
    authDomain: "app-finflow.firebaseapp.com",
    projectId: "app-finflow",
    storageBucket: "app-finflow.firebasestorage.app",
    messagingSenderId: "110567892712",
    appId: "1:110567892712:web:85fc88bedbcec4291ccb5d",
    measurementId: "G-WQ7SNTLE3C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    const user = result.user;

    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.uid);
    localStorage.setItem('email', user.email);
    localStorage.setItem('userName', user.displayName);

    return { success: true, user };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return { success: false, error };
  }
};

export { auth, provider };
