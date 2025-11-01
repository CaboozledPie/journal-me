import React from "react";
import "./HomePage.css";

interface HomePageProps {
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogout }) => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Test Website - Home</h1>
        <button className="logout-btn" onClick={onLogout}>
          Log Out
        </button>
      </header>

      <main className="home-content">
        <div className="welcome-message">
          <h2>Welcome to the Test Website!</h2>
          <p>This is the main content area of the homepage.</p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
