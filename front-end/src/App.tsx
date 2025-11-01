import { useState } from "react";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
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
    <>
      {isLoggedIn ? (
        <HomePage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
