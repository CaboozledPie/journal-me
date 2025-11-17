import React, { useState } from "react";
import "./HomePage.css";

interface PostPageProps {
  onLogout: () => void;
}

const PostPage: React.FC<PostPageProps> = ({ onLogout }) => {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    setPosts([...posts, text]);
    setText("");
  };

  const handleDelete = (index: number) => {
    setPosts(posts.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditText(posts[index]);
  };

  const saveEdit = (index: number) => {
    const updated = [...posts];
    updated[index] = editText;
    setPosts(updated);
    setEditingIndex(null);
    setEditText("");
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
                {editingIndex === i ? (
                  <>
                    <textarea
                      className="post-input"
                      rows={3}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button className="add-post-btn" onClick={() => saveEdit(i)}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <p>{p}</p>
                    <div className="post-buttons">
                      <button
                        className="edit-post-btn"
                        onClick={() => startEditing(i)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-post-btn"
                        onClick={() => handleDelete(i)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default PostPage;
