import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import "./LoginPage.css";

interface LoginPageProps {
  onLogin: () => void;
}
const url = "http://ec2-35-88-153-74.us-west-2.compute.amazonaws.com:8000/api/";
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
                  //this part for check if the backend give me the permition to login
                  if (data.access) {
                    // Save access_token to localStorage (using the access token returned from backend)
                    localStorage.setItem("access_token", data.access);
                    // Optional: save refresh token for future access token refresh
                    if (data.refresh) {
                      localStorage.setItem("refresh_token", data.refresh);
                    }
                    console.log("Access token saved to localStorage");
                    onLogin(); // redirect to homepage on success
                    console.log("成功了")
                    localStorage.setItem("access_token", data.access);
                    localStorage.setItem("name", data.name);
                    console.log(data.access);
                  } else {
                    alert("Google token verification failed!");
                  }
                })
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
         {/* ====== 🚀 Test Login Button (Skip Google) ====== */}
          <button
            // style={{
            //   marginTop: "20px",
            //   padding: "10px 20px",
            //   fontSize: "16px",
            //   cursor: "pointer",
            //   backgroundColor: "#4CAF50",
            //   color: "white",
            //   border: "none",
            //   borderRadius: "6px",
            // }}
              style={{
                color: "black",
              }}
            //onClick={() => {
              // console.log("🔧 Test Login Activated (Skipping Google)");
              // Fake token for testing
              //localStorage.setItem("access_token", "TEST_TOKEN");
              //onLogin(); // redirect to homepage
              
            //}}

            onClick={async () => {
              console.log("🔧 Test Login Activated (Skipping Google)");

                fetch(`${url}auth/test-auth/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log("Backend verification result:", data);
                  if (data.access) {
                    // Save access_token to localStorage (using the access token returned from backend)
                    localStorage.setItem("access_token", data.access);
                    // Optional: save refresh token for future access token refresh
                    if (data.refresh) {
                      localStorage.setItem("refresh_token", data.refresh);
                    }
                    console.log("Access token saved to localStorage");
                    onLogin(); // redirect to homepage on success
                    console.log("成功了")
                    localStorage.setItem("access_token", data.access);
                    localStorage.setItem("name", data.name);
                    console.log(data.access);
                  } 
              });


  // continue to homepage
  onLogin();
}}

          >
            Test Login (Skip Google)
          </button>
           {/* ====== 🚀 Test Login Button (Skip Google) ====== */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
