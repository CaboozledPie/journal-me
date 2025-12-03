import React, { useState, useEffect } from "react";
import "./HomePage.css";

interface PostPageProps {
  onLogout: () => void;
}

interface Post {
  id: number;
  title?: string;
  content: string;
}

const API_URL =
  "http://ec2-35-88-153-74.us-west-2.compute.amazonaws.com:8000/api/journal/entries/";

const PostPage: React.FC<PostPageProps> = ({ onLogout }) => {
  const [text, setText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // --- Fetch entries from backend (GET only) ---
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          console.error("Access token not found");
          onLogout();
          return;
        }

        const res = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            console.error("Authentication failed, clearing token");
            localStorage.removeItem("access_token");
            onLogout();
          }
          throw new Error(`Failed to fetch data: ${res.status}`);
        }

        const data = await res.json();
        setPosts(data.entries || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchEntries();
  }, [onLogout]);

  // Add post (Frontend-only, no backend call)
  const handleAdd = async () => {
    if (!text.trim()) return;

    const newPost = {
      title: "Untitled",
      content: text,
    };

    try {
      // Get the access token from localStorage (assuming it was stored after Google login)
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        alert("Access token not found, please log in again");
        onLogout();
        return;
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) {
        // Get detailed error information
        const errorData = await res
          .json()
          .catch(() => ({ detail: "Unknown error" }));
        console.error("Error response:", res.status, errorData);

        if (res.status === 403) {
          alert(
            `Insufficient permissions (403): ${
              errorData.detail || "Access denied, please check your permissions"
            }`
          );
        } else if (res.status === 401) {
          alert("Authentication failed, please log in again");
          localStorage.removeItem("access_token");
          onLogout();
        } else {
          alert(`Failed to create post: ${errorData.detail || res.statusText}`);
        }
        return;
      }

      const data = await res.json();

      // Prepend the newly created post with the ID from backend
      setPosts([data, ...posts]);

      setText("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert(
        `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Delete post (Frontend-only)
  const handleDelete = (index: number) => {
    setPosts(posts.filter((_, i) => i !== index));
  };

  // Start editing
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditText(posts[index].content);
  };

  // Save edited post (Frontend-only)
  const saveEdit = (index: number) => {
    const updated = [...posts];
    updated[index].content = editText;

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

      <main className="home-main">
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

        <div className="posts-scroll">
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map((p, i) => (
              <div key={p.id} className="post-item">
                {editingIndex === i ? (
                  <>
                    <textarea
                      className="post-input"
                      rows={3}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button
                      className="add-post-btn"
                      onClick={() => saveEdit(i)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <p>{p.content}</p>
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
