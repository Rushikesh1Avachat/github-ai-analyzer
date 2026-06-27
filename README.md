# GitHub Profile Analyzer API

A Node.js + Express backend service that analyzes public GitHub profiles using the GitHub public API and stores useful insights in a PostgreSQL database.

## Features

- Analyze a GitHub user's public profile by username
- Store profile insights in MySQL
- Retrieve all stored analyzed profiles
- Retrieve a single stored profile by username
- Computes derived insights like followers-per-repo and account age in days

## Tech Stack

- Node.js
- Express.js
- PostgreSQL / Neon
- GitHub public API

## Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
   On Windows PowerShell:
   ```powershell
   copy .env.example .env
   ```
4. Copy `.env.example` to `.env` and update it with your PostgreSQL/Neon settings. Do not run `npm start` with only `.env.example`.

5. Create the database schema:
   ```bash
   psql -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -f db/schema.sql
   ```

6. Start the API:
   ```bash
   npm start
   ```

## Environment Variables

Use `.env.example` as a template.

- `PGHOST` - PostgreSQL host
- `PGPORT` - PostgreSQL port
- `PGUSER` - PostgreSQL user
- `PGPASSWORD` - PostgreSQL password
- `PGDATABASE` - PostgreSQL database name
- `PGSSLMODE` - SSL mode for Postgres / Neon connections (use `require` for Neon)
- `PGCHANNELBINDING` - optional Neon channel binding mode
- Do not wrap values in quotes unless you intentionally want quote characters stripped by the loader.
- `GITHUB_TOKEN` - optional GitHub Personal Access Token to increase API rate limits

## API Endpoints

### Analyze a profile and save insights

- Method: `POST`
- URL: `/api/profiles/analyze`
- Body:
  ```json
  {
    "username": "octocat"
  }
  ```

### Fetch all stored analyzed profiles

- Method: `GET`
- URL: `/api/profiles`

### Fetch a single stored profile

- Method: `GET`
- URL: `/api/profiles/:username`

## Database Schema

The database schema is available in `db/schema.sql`.

## Postman Collection

A sample Postman collection is included at `postman_collection.json`.

## Notes

- If the same username is analyzed again, the record is updated.
- The API stores the raw GitHub profile response in `raw_data` for inspection.
