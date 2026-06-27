const express = require('express');
const pool = require('../db');
const router = express.Router();
const GITHUB_API_BASE = 'https://api.github.com/users';

const getGitHubHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'GitHub-Profile-Analyzer'
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
};

const fetchGitHubProfile = async (username) => {
  const response = await fetch(`${GITHUB_API_BASE}/${encodeURIComponent(username)}`, {
    headers: getGitHubHeaders()
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${errorText}`);
  }

  return response.json();
};

const mapProfileToRow = (profile) => {
  const publicRepos = profile.public_repos ?? 0;
  const followers = profile.followers ?? 0;
  const createdAt = profile.created_at ? new Date(profile.created_at) : null;
  const accountAgeDays = createdAt
    ? Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const followersPerRepo = publicRepos > 0 ? Number((followers / publicRepos).toFixed(2)) : 0;

  return {
    username: profile.login,
    name: profile.name,
    company: profile.company,
    blog: profile.blog,
    location: profile.location,
    email: profile.email,
    bio: profile.bio,
    public_repos: publicRepos,
    public_gists: profile.public_gists ?? 0,
    followers,
    following: profile.following ?? 0,
    github_created_at: profile.created_at ? new Date(profile.created_at) : null,
    github_updated_at: profile.updated_at ? new Date(profile.updated_at) : null,
    profile_url: profile.html_url,
    avatar_url: profile.avatar_url,
    twitter_username: profile.twitter_username,
    site_admin: profile.site_admin ? 1 : 0,
    hireable: profile.hireable ? 1 : 0,
    followers_per_repo: followersPerRepo,
    account_age_days: accountAgeDays,
    raw_data: JSON.stringify(profile),
    analyzed_at: new Date()
  };
};

router.post('/analyze', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ error: 'username is required and must be a non-empty string' });
    }

    const profileData = await fetchGitHubProfile(username.trim());
    if (!profileData) {
      return res.status(404).json({ error: 'GitHub user not found' });
    }

    const row = mapProfileToRow(profileData);

    const sql = `
      INSERT INTO analyzed_profiles (
        username, name, company, blog, location, email, bio,
        public_repos, public_gists, followers, following,
        github_created_at, github_updated_at, profile_url, avatar_url,
        twitter_username, site_admin, hireable,
        followers_per_repo, account_age_days, analyzed_at, raw_data
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      )
      ON CONFLICT (username) DO UPDATE SET
        name = EXCLUDED.name,
        company = EXCLUDED.company,
        blog = EXCLUDED.blog,
        location = EXCLUDED.location,
        email = EXCLUDED.email,
        bio = EXCLUDED.bio,
        public_repos = EXCLUDED.public_repos,
        public_gists = EXCLUDED.public_gists,
        followers = EXCLUDED.followers,
        following = EXCLUDED.following,
        github_created_at = EXCLUDED.github_created_at,
        github_updated_at = EXCLUDED.github_updated_at,
        profile_url = EXCLUDED.profile_url,
        avatar_url = EXCLUDED.avatar_url,
        twitter_username = EXCLUDED.twitter_username,
        site_admin = EXCLUDED.site_admin,
        hireable = EXCLUDED.hireable,
        followers_per_repo = EXCLUDED.followers_per_repo,
        account_age_days = EXCLUDED.account_age_days,
        analyzed_at = EXCLUDED.analyzed_at,
        raw_data = EXCLUDED.raw_data
    `;

    const values = [
      row.username,
      row.name,
      row.company,
      row.blog,
      row.location,
      row.email,
      row.bio,
      row.public_repos,
      row.public_gists,
      row.followers,
      row.following,
      row.github_created_at,
      row.github_updated_at,
      row.profile_url,
      row.avatar_url,
      row.twitter_username,
      row.site_admin,
      row.hireable,
      row.followers_per_repo,
      row.account_age_days,
      row.analyzed_at,
      row.raw_data
    ];

    await pool.query(sql, values);
    return res.status(200).json({ message: 'Profile analyzed and saved', data: row });
  } catch (error) {
    console.error('Analyze error:', error.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, name, company, location, public_repos, followers, following, account_age_days, analyzed_at FROM analyzed_profiles ORDER BY analyzed_at DESC`
    );
    return res.json(result.rows);
  } catch (error) {
    console.error('Fetch all profiles error:', error.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const result = await pool.query('SELECT * FROM analyzed_profiles WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stored profile not found' });
    }

    const profile = result.rows[0];

    return res.json(profile);
  } catch (error) {
    console.error('Fetch profile error:', error.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
