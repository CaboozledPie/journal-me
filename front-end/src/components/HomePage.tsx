
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

  // Post input state
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [streak, setStreak] = useState<number>(0);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");

  // Fetch entries on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    const fetchEntries = async () => {
      try {
        const res = await fetch(`${API_URL}journal/entries/`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();
        console.log(data)
        setPosts(data.entries || []);
      
        if (data.streak !== undefined) {
          setStreak(data.streak);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchStreak = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return;

      try {
        const res = await fetch(`${API_URL}profile/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setStreak(data.streak || 0);
      } catch (err) {
        console.error("Error fetching streak:", err);
      }
    };

    fetchEntries();
    fetchStreak();
  }, [onLogout]);

  // ==============add post function===================
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
      console.log(data)
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

//====================delete post========================

  const handleDelete = async (id: number) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      onLogout();
      return;
    }

    const res = await fetch(`${API_URL}journal/delete-entry/`, {
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



//=====================search fucntion========================

//=============handle search================
const handleSearch = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      onLogout();
      return;
    }

    // let url = API_URL;
    let url = `${API_URL}journal/entries/`;

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
//===================useless function===================
const saveEdit = (index: number) => {
    const updated = [...posts];
    updated[index].content = editText;
    setPosts(updated);

    setEditingIndex(null);
    setEditText("");
  };
//===================useless function===================

  const MEDIA_URL =
  "http://ec2-35-88-153-74.us-west-2.compute.amazonaws.com:8000/media/";

  const name = localStorage.getItem("name");
  const profileImage = localStorage.getItem("profile_picture") || "";

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">JournalMe</h1>
        <button className="logout-btn" onClick={onLogout}>
          Log Out
        </button>
      </header>

      <main className="home-main">
        <div className="left-column">
        <div className="intro-box">
          <div className="intro-greeting">
          <h2> Hi {name}!</h2>
          <p className="streaks">Current streak 🔥 : {streak} day{streak !== 1 ? "s" : ""}</p>
          </div>
          {profileImage && (
            <img
              src={profileImage}
              alt="Profile"
              className="profile-image"
            />
          )}
        </div>
        <form
          className="post-creator"
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        > 
          <h2>Create a New Entry</h2>

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
                      <label htmlFor="image" className="custom-file-btn">
              Choose Image
            </label>

            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />

            {image && <p className="file-name">{image.name}</p>}


          <button type="submit" className="add-post-btn">
            Add Post
          </button>
        </form>
        </div>
        <div className = "right-column"> 
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

        {/* ------ Posts List ------ */}
     
        <div className="posts-scroll">
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.slice().sort((a, b) => b.id - a.id).map((p, i) => (
              <div key={p.id} id={"block-" + i.toString()} className="post-item">
                {editingIndex === i ? (
                  <>
                    <button className="add-post-btn" onClick={() => saveEdit(i)}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    {/* ⭐ 显示标题 */}
                  <div className="post-header">
                    <h3 id={"post-title-" + i.toString()}className="post-title"> {p.title || "Untitled"}</h3>
                   <h3 id={"post-date-" + i.toString()} className="post-date">
                    { new Date(p.created_at).toLocaleDateString() }
                  </h3>
                   
                    </div>
                    <p id={"post-content-" + i.toString()} className="post-content">{p.content}</p>
                    {p.image && (
                  <img id={"post-image-" + i.toString()}
                    src={`${MEDIA_URL}${p.image}`}
                    alt="Post"
                    className="post-image"
                  />
                )}

                    <div className="post-buttons">
                      {/* <button className="edit-post-btn" onClick={() => startEditing(i)}>
                        Edit
                      </button> */}
                      <button id={"delete-" + i.toString()}className="delete-post-btn" onClick={() => handleDelete(p.id)}>
                        Delete
                      </button>
                    </div>
                    
                  </>
                )}
              </div>
            ))
          )}
        </div>
       </div> 
      </main>
    </div>
  );
};

export default PostPage;
