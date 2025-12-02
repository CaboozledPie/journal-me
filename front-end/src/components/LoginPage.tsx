import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import "./LoginPage.css";

interface LoginPageProps {
  onLogin: () => void;
}
const url="http://ec2-35-88-153-74.us-west-2.compute.amazonaws.com:8000/api/";
// ========== ADD THIS ==========
// (window as any).ping = function () {
//   fetch(`${url}ping/`)
//     .then((res) => res.json())
//     .then((data) => {
//       console.log("PING SUCCESS:", data);
//       alert(JSON.stringify(data));
//     })
//     .catch((err) => {
//       console.error("PING ERROR:", err);
//     });
// };
// ==============================

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome to Test Website</h1>

        <div className="google-login">
          <p style={{ margin: "15px 0", fontWeight: 500 }}>
            Sign in with Google
          </p>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const idToken = credentialResponse.credential;
              console.log("✅ Google ID Token:", idToken);
              console.log("test1");
              // Send the token to backend for verification
              fetch(`${url}auth/google/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log("Backend verification result:", data);

                  //=================================
                  //this part for check if the backend give me the permition to login
                  if (data.access) {
                     // Save tokens
                      localStorage.setItem("access", data.access);
                      localStorage.setItem("refresh", data.refresh);

                      console.log("Access token saved:", data.access);
                      console.log("Refresh token saved:", data.refresh);

                      onLogin(); // redirect to homepage
                    console.log("成功了")
                  } else {
                    alert("Google token verification failed!");
                  }
                })
                 //=================================
                .catch((err) => {
                  console.error("Network error:", err);
                  alert("Network error, please try again.");
                });
            }}
            onError={() => {
              console.log("❌ Google Login Failed");
              alert("Google login failed, please try again.");
            }}
          />
        </div>
      </div>
    </div>
  );
};



export default LoginPage;
