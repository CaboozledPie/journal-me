import React from "react";
import "./HomePage.css";

interface HomePageProps {
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLogout }) => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">测试网站 首页</h1>
        <button className="logout-btn" onClick={onLogout}>
          退出登录
        </button>
      </header>

      <main className="home-content">
        <div className="welcome-message">
          <h2>欢迎来到 测试网站!</h2>
          <p>这里是首页内容区域</p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
