const { query } = require('../config/db');

async function create({ title, createdBy }) {
  const { rows } = await query(
    `INSERT INTO content_ideas (title, created_by) VALUES ($1, $2) RETURNING *`,
    [title, createdBy]
  );
  return rows[0];
}

async function findAll() {
  const { rows } = await query(
    `SELECT i.*, m.full_name AS created_by_name
       FROM content_ideas i
       JOIN team_members m ON m.id = i.created_by
      WHERE i.status != 'archived'
      ORDER BY i.created_at DESC`
  );
  return rows;
}

async function markConverted(id, contentId) {
  const { rows } = await query(
    `UPDATE content_ideas SET status = 'converted', converted_content_id = $1, updated_at = now()
     WHERE id = $2 RETURNING *`,
    [contentId, id]
  );
  return rows[0];
}

module.exports = { create, findAll, markConverted };
