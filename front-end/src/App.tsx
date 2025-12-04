import { useState } from "react";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
//const ENABLE_GSI = import.meta.env.VITE_ENABLE_GSI === "true";

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//   };

//   {ENABLE_GSI && (
//     return (
//     // ⚠️ 这里替换成你自己的 Client ID
//     <GoogleOAuthProvider clientId="219694033881-4od4hi84uakag1cf7fuucm6s6u8q7ef9.apps.googleusercontent.com">
//       {isLoggedIn ? (
//         <HomePage onLogout={handleLogout} />
//       ) : (
//         <LoginPage onLogin={handleLogin} />
//       )}
//     </GoogleOAuthProvider>
//   );
//   )}
//   return true;
// }
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const ENABLE_GSI = import.meta.env.VITE_ENABLE_GSI === "true";

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  if (!ENABLE_GSI) {
    // 不启用 Google，直接展示 skip 版 LoginPage
  
    return <div>
      {isLoggedIn ? (
        <HomePage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
    /*(
      {isLoggedIn ? (
        <HomePage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    );*/
  }

  // 启用 Google
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
