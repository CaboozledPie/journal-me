let accessToken = null;
//const API_URL = "http://127.0.0.1:8000/api/";
const API_URL = "http://ec2-35-88-153-74.us-west-2.compute.amazonaws.com:8000/api/";

function handleCredentialResponse(response) {
    const token = response.credential; // Google ID token

    // Send it to yodur Django backend for verification
    fetch(`${API_URL}auth/google/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({token: token}),
    })
        .then((res) => {
            if (!res.ok) {
                // Parse the error response body
                return res.json().then(err => {
                    console.error("Backend error response:", err);
                    throw new Error(err.detail || JSON.stringify(err)); // Assuming 'detail' or general JSON error
                });
            }
            return res.json();
        })
        .then((data) => {
            console.log("Backend response:", data);
            accessToken = data.access // change to localStorage later!
            alert(`Logged in as: ${data.name}`);
        })
        .catch((err) => console.error("Error:", err));
};

window.postJournalEntry = function() {
    const form = document.getElementById("journal-entry-form");
    const formData = new FormData(form);
    
    fetch(`${API_URL}journal/entries/`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
        body: formData
    })
        .then((res) => {
            if (!res.ok) {
                // Parse the error response body
                return res.json().then(err => {
                    console.error("Backend error response:", err);
                    throw new Error(err.detail || JSON.stringify(err)); // Assuming 'detail' or general JSON error
                });
            }
            return res.json();
        })
        .then((data) => {
            console.log("Backend response:", data);
        })
        .catch((err) => console.error("Error:", err));
}

window.getJournalEntry = function() {
    const search_query = document.getElementById("entry-search").value;
    var get_url = `${API_URL}journal/entries/`;
    if (search_query !== "") {
        get_url += `?query=${search_query}`;
    }
    console.log(`fetching at ${get_url}`);
    fetch(get_url, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            if (!res.ok) {
                // Parse the error response body
                return res.json().then(err => {
                    console.error("Backend error response:", err);
                    throw new Error(err.detail || JSON.stringify(err)); // Assuming 'detail' or general JSON error
                });
            }
            return res.json();
        })
        .then((data) => {
            console.log("Backend response:", data);
        })
        .catch((err) => console.error("Error:", err));
}

window.deleteJournalEntry = function() {
    const delete_id = document.getElementById("entry-remove-id").value;

    fetch(`${API_URL}journal/delete-entry/`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "entry-id": delete_id,
        }),
    })
        .then((res) => {
            if (!res.ok) {
                // Parse the error response body
                return res.json().then(err => {
                    console.error("Backend error response:", err);
                    throw new Error(err.detail || JSON.stringify(err)); // Assuming 'detail' or general JSON error
                });
            }
            return res.json();
        })
        .then((data) => {
            console.log("Backend response:", data);
        })
        .catch((err) => console.error("Error:", err));
}

window.ping = function() {
    fetch(`${API_URL}ping/`, {})
        .then((res) => res.json())
        .then((data) => alert(JSON.stringify(data)))
        .catch((err) => console.error(err));
}

window.protectedView = function() {
    console.log(accessToken);
    fetch(`${API_URL}protected/`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    })
        .then((res) => res.json())
        .then((data) => alert(JSON.stringify(data)))
        .catch((err) => console.error(err));
};

window.getProfile = function() {
    console.log(accessToken);
    fetch(`${API_URL}profile/`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        }
    })
        .then((res) => res.json())
        .then((data) => alert(JSON.stringify(data)))
        .catch((err) => console.error(err));
}

window.onload = function() {
  google.accounts.id.initialize({
    client_id: "219694033881-4od4hi84uakag1cf7fuucm6s6u8q7ef9.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });

  google.accounts.id.renderButton(
    document.getElementById("google-login"),
    { theme: "outline", size: "large" }
  );
};
