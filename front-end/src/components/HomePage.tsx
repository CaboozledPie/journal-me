import React, { useState, useEffect } from "react";
import "./HomePage.css";

interface PostPageProps {
  onLogout: () => void;
}

interface Post {
  id: number;
  title: string;      
  content: string;    
  image?: string;     // optional
}

const API_URL =
  "http://ec2-35-88-153-74.us-west-2.compute.amazonaws.com:8000/api/journal/entries/";
const DELETE_URL =
  "http://ec2-35-88-153-74.us-west-2.compute.amazonaws.com:8000/api/journal/delete-entry/";

const PostPage: React.FC<PostPageProps> = ({ onLogout }) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // --- Fetch entries from backend ---
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
            console.error("Authentication failed");
            localStorage.removeItem("access_token");
            onLogout();
            return;
          }
          throw new Error(`Fetch failed: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched entries 1:", data);

        // Auto adapt backend structure:
        // If backend returns {entries: [...]}
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (Array.isArray(data.entries)) {
          setPosts(data.entries);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchEntries();
  }, [onLogout]);

  // --- Add new Post ---
  const handleAdd = async () => {
    if (!title.trim() || !text.trim()) {
      alert("Title and content cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", text);

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        alert("Access token missing");
        onLogout();
        return;
      }

      console.log("📤 Sending POST FormData:");
      for (const pair of formData.entries()) {
        console.log("➡️", pair[0], "=", pair[1]);
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      console.log("🟡 Status:", res.status);

      const newPost = await res.json().catch(() => null);
      console.log("🟢 Response:", newPost);

      if (!res.ok) {
        alert(`Failed: ${newPost?.detail || res.statusText}`);
        return;
      }

      // Insert new post at top
      setPosts([newPost, ...posts]);

      // Clear inputs
      setText("");
      setTitle("");
    } catch (err) {
      console.error(" Network error:", err);
    }
  };

  // --- Local delete (frontend only) ---
  // const handleDelete = (index: number) => {
  //   setPosts(posts.filter((_, i) => i !== index));
  // };
  const handleDelete = async (id: number) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      onLogout();
      return;
    }

    const res = await fetch(`${DELETE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        "entry-id": id,
      }),
    });

    console.log("DELETE response:", res.status);

    const data = await res.json().catch(() => null);
    console.log("DELETE response body:", data);

    if (!res.ok) {
      alert(`Delete failed: ${data?.detail || res.statusText}`);
      return;
    }

    // ✔ 用 id 删除 UI
    setPosts(posts.filter(p => p.id !== id));

  } catch (err) {
    console.error("Delete error:", err);
  }
};

  

  // --- Start editing ---
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditText(posts[index].content);
  };

  // --- Save editing (frontend only) ---
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

        {/* ------ Create Post UI ------ */}
        <div className="post-creator">
          <h2>Create a New Post</h2>

          <input
            className="post-title-input"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

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

        {/* ------ Posts List ------ */}
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
                    {/* ⭐ 显示标题 */}
                    <h3 className="post-title">{p.title || "Untitled"}</h3>
                    <p>{p.content}</p>

                    <div className="post-buttons">
                      <button className="edit-post-btn" onClick={() => startEditing(i)}>
                        Edit
                      </button>
                      <button className="delete-post-btn" onClick={() => handleDelete(p.id)}>
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
