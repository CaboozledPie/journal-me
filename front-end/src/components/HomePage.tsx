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
        // const res = await fetch(API_URL);
        const accessToken = localStorage.getItem("access");

        const res = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        });
        const data = await res.json();

        setPosts(data.entries || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchEntries();
  }, []);

  // Add post (Frontend-only, no backend call)
//   const handleAdd = () => {
//   if (!text.trim()) return;

//   const newPost = {
//     id: Date.now(), // temporary unique ID
//     title: "Untitled",
//     content: text,
//   };

//   // Prepend so it appears on top
//   setPosts([newPost, ...posts]);

//   setText("");
// };
const handleAdd = async () => {
  if (!text.trim()) return;

  const accessToken = localStorage.getItem("access");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        title: "Untitled",
        content: text
      })
    });

    const data = await res.json();
    console.log("POST RESULT:", data);

    if (res.ok) {
      // Add new post to UI
      setPosts([data, ...posts]);
      setText("");
    } else {
      console.error("POST FAILED:", data);
    }

  } catch (err) {
    console.error("Network POST error:", err);
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
    <button className="logout-btn" onClick={onLogout}>Log Out</button>
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
      <button className="add-post-btn" onClick={handleAdd}>Add Post</button>
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
                <button className="add-post-btn" onClick={() => saveEdit(i)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <p>{p.content}</p>
                <div className="post-buttons">
                  <button className="edit-post-btn" onClick={() => startEditing(i)}>
                    Edit
                  </button>
                  <button className="delete-post-btn" onClick={() => handleDelete(i)}>
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
