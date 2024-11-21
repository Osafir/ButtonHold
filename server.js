const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid"); // Pour générer des IDs uniques

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Base de données simulée
const users = []; // Stocke les utilisateurs
const leaderboard = []; // Stocke les scores

// Endpoint pour l'inscription
app.post("/register", (req, res) => {
  const { email, password, pseudo } = req.body;

  // Validation des champs
  if (!email || !password || !pseudo) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  // Vérifie si l'utilisateur existe déjà
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ error: "Cet email est déjà utilisé." });
  }

  // Ajout d'un nouvel utilisateur
  const newUser = {
    id: uuidv4(),
    email,
    password,
    pseudo,
    profileImage: "default.png", // Image de profil par défaut
    highScore: 0, // Score initial
  };
  users.push(newUser);

  res.status(201).json({ message: "Inscription réussie." });
});

// Endpoint pour la connexion
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Recherche de l'utilisateur
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ error: "Email ou mot de passe incorrect." });
  }

  res.status(200).json({ message: "Connexion réussie.", user });
});

// Endpoint pour mettre à jour le profil (changement de l'image)
app.put("/profile", (req, res) => {
  const { id, profileImage } = req.body;

  const user = users.find(user => user.id === id);

  if (!user) {
    return res.status(404).json({ error: "Utilisateur non trouvé." });
  }

  user.profileImage = profileImage;
  res.status(200).json({ message: "Image de profil mise à jour." });
});

// Endpoint pour enregistrer un score
app.post("/score", (req, res) => {
  const { id, time } = req.body;

  const user = users.find(user => user.id === id);

  if (!user) {
    return res.status(404).json({ error: "Utilisateur non trouvé." });
  }

  // Met à jour le score uniquement si supérieur
  if (time > user.highScore) {
    user.highScore = time;
  }

  // Met à jour ou ajoute au leaderboard
  const leaderboardEntry = leaderboard.find(entry => entry.id === id);
  if (leaderboardEntry) {
    leaderboardEntry.time = user.highScore;
  } else {
    leaderboard.push({ id, pseudo: user.pseudo, time: user.highScore, profileImage: user.profileImage });
  }

  leaderboard.sort((a, b) => b.time - a.time); // Trie par score décroissant
  res.status(200).json({ message: "Score mis à jour." });
});

// Endpoint pour récupérer le leaderboard
app.get("/leaderboard", (req, res) => {
  res.json(leaderboard.slice(0, 10)); // Renvoie les 10 meilleurs scores
});

// Démarre le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
