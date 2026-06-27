const express = require('express');
const profilesRouter = require('./routes/profiles');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/profiles', profilesRouter);

app.get('/', (req, res) => {
  res.send({
    service: 'GitHub Profile Analyzer API',
    endpoints: [
      'POST /api/profiles/analyze',
      'GET /api/profiles',
      'GET /api/profiles/:username'
    ]
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const start = async () => {
  try {
    const db = await pool.query('SELECT current_database()');
    console.log('Connected Database:', db.rows[0].current_database);

    const tables = await pool.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_name = 'analyzed_profiles'
    `);

    console.log('Table Check:', tables.rows);

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error.message || error);
    process.exit(1);
  }
};
start()
