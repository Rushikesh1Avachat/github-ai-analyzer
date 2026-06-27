const express = require("express");
const profilesRouter = require("./routes/profiles");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/api/profiles", profilesRouter);

app.get("/", async (req, res) => {
  res.json({
    service: "GitHub Profile Analyzer API",
    endpoints: [
      "POST /api/profiles/analyze",
      "GET /api/profiles",
      "GET /api/profiles/:username"
    ]
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// Export the Express app for Vercel
module.exports = app;

// Run locally only
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const pool = require("./db");

  const PORT = process.env.PORT || 3000;

  (async () => {
    try {
      const db = await pool.query("SELECT current_database()");
      console.log("Connected Database:", db.rows[0].current_database);

      const tables = await pool.query(`
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_name = 'analyzed_profiles'
      `);

      console.log("Table Check:", tables.rows);

      app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error(error);
    }
  })();
}
