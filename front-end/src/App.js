import './App.css';
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple demo logic (in production, validate via backend)
    if (username === 'admin' && password === '123456') {
      setIsLoggedIn(true);
    } else {
      alert('Incorrect username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="App">
      <header className="App-header">
        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="login-form">
            <h2>Journal Me Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Log In</button>
          </form>
        ) : (
          <div>
            <h2>Welcome back, {username}!</h2>
            <p>This is your Journal Me page.</p>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
