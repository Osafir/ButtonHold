const backendUrl = 'https://buttonhold.onrender.com';

// Sections
const authSection = document.getElementById("authSection");
const profileSection = document.getElementById("profileSection");
const duelSection = document.getElementById("duelSection");
const leaderboardSection = document.getElementById("leaderboardSection");

// Navigation
document.getElementById("loginButton").addEventListener("click", () => showSection(authSection));
document.getElementById("registerButton").addEventListener("click", () => showSection(authSection));
document.getElementById("profileButton").addEventListener("click", () => showSection(profileSection));
document.getElementById("duelButton").addEventListener("click", () => showSection(duelSection));
document.getElementById("leaderboardButton").addEventListener("click", () => loadLeaderboard());

// Inscription
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const pseudo = document.getElementById("registerPseudo").value;

  const response = await fetch(`${backendUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, pseudo })
  });

  if (response.ok) {
    alert("Inscription réussie !");
  } else {
    alert("Erreur lors de l'inscription.");
  }
});

// Connexion
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch(`${backendUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("user", JSON.stringify(data.user));
    alert("Connexion réussie !");
  } else {
    alert("Erreur de connexion.");
  }
});

// Charger le leaderboard
async function loadLeaderboard() {
  showSection(leaderboardSection);
  const response = await fetch(`${backendUrl}/leaderboard`);
  const leaderboard = await response.json();

  const tbody = document.querySelector("#leaderboardTable tbody");
  tbody.innerHTML = "";

  leaderboard.forEach((entry, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td><img src="./images/${entry.profileImage}" alt="${entry.pseudo}" style="width:50px; height:50px; border-radius:50%;"></td>
        <td>${entry.pseudo}</td>
        <td>${entry.time}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Afficher une section
function showSection(section) {
  [authSection, profileSection, duelSection, leaderboardSection].forEach(s => s.classList.add("hidden"));
  section.classList.remove("hidden");
}
