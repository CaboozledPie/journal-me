let accessToken = null;

function handleCredentialResponse(response) {
  const token = response.credential; // Google ID token

  // Send it to your Django backend for verification
  fetch("http://127.0.0.1:8000/api/auth/google/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Backend response:", data);
      alert(`Logged in as: ${data.user}`);
    })
    .catch((err) => console.error("Error:", err));
};

window.protectedView = function() {
    fetch("http://127.0.0.1:8000/api/protected/", {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    })
        .then((res) => res.json())
        .then((data) => alert(JSON.stringify(data)))
        .catch((err) => console.error(err));
};

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
