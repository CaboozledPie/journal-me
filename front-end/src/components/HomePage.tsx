import React, { useState } from "react";
import "./HomePage.css"; // reuse same styles for layout

interface PostPageProps {
  onLogout: () => void;
}

const PostPage: React.FC<PostPageProps> = ({ onLogout }) => {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState<string[]>([]);

  const handleAdd = () => {
    if (!text.trim()) return;
    setPosts([...posts, text]);
    setText("");
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Journal Posts</h1>
        <button className="logout-btn" onClick={onLogout}>
          Log Out
        </button>
      </header>

      <main className="home-content">
        <div className="post-creator">
          <h2>Create a New Post</h2>
          <textarea
            className="post-input"
            rows={3}
            placeholder="Write your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="add-post-btn" onClick={handleAdd}>
            Add Post
          </button>
        </div>

        <div className="posts-list">
          {posts.length === 0 ? (
            <p>No posts yet. Start writing something!</p>
          ) : (
            posts.map((p, i) => (
              <div key={i} className="post-item">
                <p>{p}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default PostPage;
