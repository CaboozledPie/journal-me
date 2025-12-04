import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import "./LoginPage.css";

interface LoginPageProps {
  onLogin: () => void;
}
const url = "http://ec2-35-88-153-74.us-west-2.compute.amazonaws.com:8000/api/";


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
   
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
        onClick={() => {
          console.log("🔧 Testing /auth/test-auth/ ...");

          // Get saved token (from previous Google login)
          const accessToken = localStorage.getItem("access_token");
          if (!accessToken) {
            alert("❌ No access token found! Please login with Google first.");
            return;
          }

          fetch(`${url}auth/test-auth/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({}),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Auth failed");
              return res.json();
            })
            .then((data) => {
              console.log("Backend /test-auth/ result:", data);

              // ⭐ save user info returned from backend
              if (data.access) localStorage.setItem("access_token", data.access);
              if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
              if (data.name) localStorage.setItem("name", data.name);
              if (data.email) localStorage.setItem("email", data.email);
              if (data.picture) localStorage.setItem("picture", data.picture);

              

              onLogin(); // go to homepage
            })
            .catch((err) => {
              console.error("Test-auth error:", err);
              alert("Backend auth test failed!");
            });
        }}
      >
        Skip Google (Use test-auth)
      </button>


        </div>
      </div>
    </div>
  );
};

export default LoginPage;
