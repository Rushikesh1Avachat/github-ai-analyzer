# GitHub AI Analyzer

GitHub AI Analyzer is a backend REST API built with Node.js, Express.js, and PostgreSQL that fetches GitHub user profiles using the GitHub REST API, analyzes profile statistics, calculates useful metrics, and stores the analyzed data in a Neon PostgreSQL database.

## Features

- Analyze any public GitHub profile
- Fetch live data from GitHub REST API
- Store analyzed profiles in PostgreSQL (Neon)
- Retrieve all analyzed profiles
- Retrieve profile by username
- Automatic update if profile already exists
- RESTful API architecture
- Environment variable support
- Ready for deployment on Vercel

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Neon Database
- GitHub REST API
- Axios
- dotenv
- Vercel

## API Endpoints

POST /api/profiles/analyze

GET /api/profiles

GET /api/profiles/:username
