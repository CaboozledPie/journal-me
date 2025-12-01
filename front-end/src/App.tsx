import { useState } from "react";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    // ⚠️ 这里替换成你自己的 Client ID
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
