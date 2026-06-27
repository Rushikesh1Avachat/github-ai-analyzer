CREATE TABLE IF NOT EXISTS analyzed_profiles (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  company VARCHAR(255),
  blog VARCHAR(512),
  location VARCHAR(255),
  email VARCHAR(255),
  bio TEXT,
  public_repos INTEGER DEFAULT 0,
  public_gists INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  github_created_at TIMESTAMP,
  github_updated_at TIMESTAMP,
  profile_url VARCHAR(512),
  avatar_url VARCHAR(512),
  twitter_username VARCHAR(255),
  site_admin BOOLEAN DEFAULT false,
  hireable BOOLEAN DEFAULT false,
  followers_per_repo NUMERIC(10,2) DEFAULT 0,
  account_age_days INTEGER DEFAULT 0,
  analyzed_at TIMESTAMP NOT NULL,
  raw_data JSONB
);

CREATE INDEX IF NOT EXISTS idx_username ON analyzed_profiles(username);
