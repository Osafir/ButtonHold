const express = require("express");
const cors = require("cors");
const app = express();

// Middleware pour gérer les CORS et JSON
app.use(cors());
app.use(express.json());

// Tableau pour stocker le leaderboard
let leaderboard = [];

// Endpoint pour ajouter un score
app.post("/score", (req, res) => {
  const { name, time } = req.body;

  // Vérifie que les données envoyées sont valides
  if (!name || typeof time !== "number" || time < 10) {
    return res.status(400).json({ error: "Invalid score or name, minimum 10 seconds required." });
  }

  // Ajoute le score au leaderboard
  leaderboard.push({ name, time });

  // Trie par temps décroissant et garde les 10 meilleurs scores
  leaderboard.sort((a, b) => b.time - a.time);
  leaderboard = leaderboard.slice(0, 10);

  res.sendStatus(200);
});

// Endpoint pour récupérer le leaderboard
app.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

// Démarre le serveur
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
