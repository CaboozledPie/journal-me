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
  created_at: string;   //time
}

const API_URL =
  "http://ec2-35-88-153-74.us-west-2.compute.amazonaws.com:8000/api/";

const PostPage: React.FC<PostPageProps> = ({ onLogout }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");

  // Post input state
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [streak, setStreak] = useState<number>(0);

  // Fetch entries on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    const fetchEntries = async () => {
      try {
        const res = await fetch(`${API_URL}journal/entries/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();
        setPosts(data.entries || []);
      
        if (data.streak !== undefined) {
          setStreak(data.streak);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchEntries();
  }, [onLogout]);

  // Add post
  const handleAdd = async () => {
    if (!text.trim() || !title.trim()) return;

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error("Not signed in");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", text);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`${API_URL}journal/entries/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Backend error:", err);
        throw new Error(err.detail || "Error creating post");
      }

      const data = await res.json();

      // Add new post to UI
      setPosts([data, ...posts]);

      // Update streak
      if (data.streak !== undefined) {
        setStreak(data.streak);
      }

      // Reset fields
      setTitle("");
      setText("");
      setImage(null);
    } catch (err) {
      console.error("Error:", err);
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


//=============handle search================
const handleSearch = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      onLogout();
      return;
    }

    let url = API_URL;
    if (search.trim() !== "") {
      url += `?query=${encodeURIComponent(search.trim())}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) return;

    const data = await res.json();

    if (Array.isArray(data)) setPosts(data);
    else if (Array.isArray(data.entries)) setPosts(data.entries);
    else setPosts([]);
  } catch (err) {
    console.error("Search error:", err);
  }
};


  

  // // --- Start editing ---
  // const startEditing = (index: number) => {
  //   setEditingIndex(index);
  //   setEditText(posts[index].content);
  // };

  // --- Save editing (frontend only) ---
  // ===========This is useless code right now, we don't have edit button needed==============

  const saveEdit = (index: number) => {
    const updated = [...posts];
    updated[index].content = editText;
    setPosts(updated);

  const name = localStorage.getItem("name");

  // ===========This is useless code right now, we don't have edit button needed==============

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Journal Posts</h1>
        <button className="logout-btn" onClick={onLogout}>
          Log Out
        </button>
      </header>

      <main className="home-main">
        <form
          className="post-creator"
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        > 
          <h2> Hi {name}!</h2>
          <p>🔥 Current streak: {streak} day{streak !== 1 ? "s" : ""}</p>
          <h2>Create a New Post</h2>

          <label htmlFor="title">Title:</label>
          <input
            className="title-input"
            type="text"
            id="title"
            name="title"
            placeholder="Add a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="content">Content:</label>
          <textarea
            className="post-input"
            rows={3}
            placeholder="Write your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            id="content"
            name="content"
            required
          />

          <label htmlFor="image">Image (optional):</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />

          <button type="submit" className="add-post-btn">
            Add Post
          </button>
        </div>
        {/* ------ Search bar ------ */}
      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      <button className="search-btn" onClick={handleSearch}>
          Search
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
                    <button className="add-post-btn" onClick={() => saveEdit(i)}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    {/* ⭐ 显示标题 */}
                  
                  <h3 className="post-date">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}
                  </h3>
                    <h3 className="post-title">{p.title || "Untitled"}</h3>
                    <p>{p.content}</p>

                    <div className="post-buttons">
                      {/* <button className="edit-post-btn" onClick={() => startEditing(i)}>
                        Edit
                      </button> */}
                      <button className="delete-post-btn" onClick={() => handleDelete(p.id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}


                <div className="post-buttons">
                  <button
                    className="delete-post-btn"
                    onClick={() => handleDelete(i)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default PostPage;
