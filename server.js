const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Leaderboard en mémoire
let leaderboard = [];

// Endpoint pour ajouter un score
app.post("/score", (req, res) => {
  const { name, time } = req.body;

  // Validation basique des données
  if (!name || typeof time !== "number" || time < 10) {
    return res.status(400).json({ error: "Invalid score or name. Minimum 10 seconds required." });
  }

  // Ajoute le score au leaderboard et trie
  leaderboard.push({ name, time });
  leaderboard.sort((a, b) => b.time - a.time);
  leaderboard = leaderboard.slice(0, 10); // Conserve uniquement les 10 meilleurs scores

  res.sendStatus(200);
});

// Endpoint pour récupérer le leaderboard
app.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

// Démarre le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
