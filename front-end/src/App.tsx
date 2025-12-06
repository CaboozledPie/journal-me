import { useState } from "react";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const ENABLE_GSI = import.meta.env.VITE_ENABLE_GSI === "true";

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  if (!ENABLE_GSI) {
  
  
    return <div>
      {isLoggedIn ? (
        <HomePage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>

  }


  return (
    <GoogleOAuthProvider clientId="219694033881-4od4hi84uakag1cf7fuucm6s6u8q7ef9.apps.googleusercontent.com">
      {isLoggedIn ? (
        <HomePage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </GoogleOAuthProvider>
  );
}


export default App;
