const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Database
const db = new sqlite3.Database("./database.db");

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY,
    description TEXT,
    amount REAL,
    type TEXT,
    category TEXT,
    date TEXT,
    timestamp TEXT
  )
`);

// Get all transactions
app.get("/transactions", (req, res) => {
  db.all("SELECT * FROM transactions ORDER BY timestamp DESC", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Add transaction
app.post("/transactions", (req, res) => {
  const t = req.body;
  db.run(
    `INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [t.id, t.description, t.amount, t.type, t.category, t.date, t.timestamp],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

// Update transaction
app.put("/transactions/:id", (req, res) => {
  const t = req.body;
  db.run(
    `UPDATE transactions SET description=?, amount=?, type=?, category=?, date=?, timestamp=? WHERE id=?`,
    [t.description, t.amount, t.type, t.category, t.date, t.timestamp, t.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

// Delete transaction
app.delete("/transactions/:id", (req, res) => {
  db.run("DELETE FROM transactions WHERE id=?", [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
