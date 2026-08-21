const { query } = require('../config/db');

const SELECT_BASE = `
  SELECT c.*, a.full_name AS assignee_name, o.full_name AS created_by_name
    FROM content_items c
    LEFT JOIN team_members a ON a.id = c.assignee_id
    LEFT JOIN team_members o ON o.id = c.created_by
`;

async function create({ title, contentType, scheduledAt, assigneeId, createdBy, ideaId }) {
  const { rows } = await query(
    `INSERT INTO content_items (title, content_type, scheduled_at, assignee_id, created_by, idea_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, contentType, scheduledAt || null, assigneeId || null, createdBy, ideaId || null]
  );
  return rows[0];
}

async function findById(id) {
  const { rows } = await query(`${SELECT_BASE} WHERE c.id = $1`, [id]);
  return rows[0] || null;
}

async function findAll({ from, to } = {}) {
  const conditions = [`c.status != 'archived'`];
  const params = [];
  if (from) { params.push(from); conditions.push(`c.scheduled_at >= $${params.length}`); }
  if (to) { params.push(to); conditions.push(`c.scheduled_at <= $${params.length}`); }
  const { rows } = await query(
    `${SELECT_BASE} WHERE ${conditions.join(' AND ')} ORDER BY (c.scheduled_at IS NULL), c.scheduled_at ASC`,
    params
  );
  return rows;
}

async function findReadyToPublish() {
  const { rows } = await query(
    `${SELECT_BASE} WHERE c.status = 'ready' ORDER BY (c.scheduled_at IS NULL), c.scheduled_at ASC`
  );
  return rows;
}

async function setStatus(id, status) {
  const { rows } = await query(
    `UPDATE content_items SET status = $1, updated_at = now() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows[0];
}

async function markPublished(id) {
  const { rows } = await query(
    `UPDATE content_items SET status = 'published', published_at = now(), updated_at = now()
     WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
}

module.exports = { create, findById, findAll, findReadyToPublish, setStatus, markPublished };
