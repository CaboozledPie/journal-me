import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import "./LoginPage.css";

interface LoginPageProps {
  onLogin: () => void;
}

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

              // Send the token to backend for verification
              fetch("http://127.0.0.1:5001/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log("Backend verification result:", data);

                  //=================================
                  //this part for check if the backend give me the permition to login
                  if (data.success) {
                    onLogin(); // redirect to homepage on success
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
