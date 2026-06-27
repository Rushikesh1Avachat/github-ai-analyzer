const { Pool } = require('pg');
require('dotenv').config();

const normalizeEnvValue = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/^(['"])(.*)\1$/, '$2');
};

const PGHOST = normalizeEnvValue(process.env.PGHOST) || 'localhost';
const PGPORT = normalizeEnvValue(process.env.PGPORT) || '5432';
const PGUSER = normalizeEnvValue(process.env.PGUSER) || 'postgres';
const PGPASSWORD = normalizeEnvValue(process.env.PGPASSWORD) || '';
const PGDATABASE = normalizeEnvValue(process.env.PGDATABASE) || 'github_profile_analyzer';
const PGSSLMODE = normalizeEnvValue(process.env.PGSSLMODE) || 'disable';

const ssl = PGSSLMODE === 'require' || PGSSLMODE === 'no-verify'
  ? { rejectUnauthorized: false }
  : undefined;

const pool = new Pool({
  host: PGHOST,
  port: Number(PGPORT),
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  ssl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

module.exports = pool;
