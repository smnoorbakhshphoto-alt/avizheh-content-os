const { query } = require('../config/db');

const PUBLIC_FIELDS = 'id, full_name, username, role, created_at';

async function findByUsernameInternal(username) {
  const { rows } = await query('SELECT * FROM team_members WHERE username = $1', [username]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await query(`SELECT ${PUBLIC_FIELDS} FROM team_members WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function findAll() {
  const { rows } = await query(`SELECT ${PUBLIC_FIELDS} FROM team_members ORDER BY full_name ASC`);
  return rows;
}

async function create({ fullName, username, passwordHash, role = 'member' }) {
  const { rows } = await query(
    `INSERT INTO team_members (full_name, username, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING ${PUBLIC_FIELDS}`,
    [fullName, username, passwordHash, role]
  );
  return rows[0];
}

async function existsByUsername(username) {
  const { rows } = await query('SELECT 1 FROM team_members WHERE username = $1', [username]);
  return rows.length > 0;
}

module.exports = { findByUsernameInternal, findById, findAll, create, existsByUsername };
