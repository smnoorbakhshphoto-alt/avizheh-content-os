const { query } = require('../config/db');

// قالب‌های کار پیش‌فرض بر اساس نوع محتوا (Smart Defaults)
const TASK_TEMPLATES = {
  reel: ['تدوین', 'طراحی کاور', 'نوشتن کپشن', 'تأیید نهایی'],
  story: ['طراحی', 'نوشتن متن', 'تأیید نهایی'],
  post: ['آماده‌سازی و ویرایش', 'نوشتن کپشن', 'تأیید نهایی'],
  carousel: ['آماده‌سازی و ویرایش', 'نوشتن کپشن', 'تأیید نهایی'],
  photo: ['ویرایش و رتوش', 'نوشتن کپشن', 'تأیید نهایی'],
};

function templateFor(contentType) {
  return TASK_TEMPLATES[contentType] || ['آماده‌سازی', 'تأیید نهایی'];
}

async function createDefaultTasks(contentId, { contentType, assigneeId, dueAt }) {
  const titles = templateFor(contentType);
  const rows = [];
  for (let i = 0; i < titles.length; i++) {
    const { rows: inserted } = await query(
      `INSERT INTO content_tasks (content_id, title, assignee_id, sort_order, due_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [contentId, titles[i], assigneeId || null, i, dueAt || null]
    );
    rows.push(inserted[0]);
  }
  return rows;
}

async function findByContentId(contentId) {
  const { rows } = await query(
    `SELECT t.*, m.full_name AS assignee_name
       FROM content_tasks t
       LEFT JOIN team_members m ON m.id = t.assignee_id
      WHERE t.content_id = $1
      ORDER BY t.sort_order ASC`,
    [contentId]
  );
  return rows;
}

async function findById(id) {
  const { rows } = await query(`SELECT * FROM content_tasks WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function complete(id) {
  const { rows } = await query(
    `UPDATE content_tasks SET status = 'done', completed_at = now() WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0];
}

async function countPending(contentId) {
  const { rows } = await query(
    `SELECT count(*)::int AS pending FROM content_tasks WHERE content_id = $1 AND status = 'pending'`,
    [contentId]
  );
  return rows[0].pending;
}

// فقط کار «فعلی» هر محتوا (اولین کار انجام‌نشده بر اساس sort_order) نمایش داده می‌شود
async function findForToday(memberId) {
  const { rows } = await query(
    `SELECT t.*, c.title AS content_title, c.content_type, c.id AS content_id,
            (t.due_at IS NOT NULL AND t.due_at < now()) AS is_overdue
       FROM content_tasks t
       JOIN content_items c ON c.id = t.content_id
      WHERE t.assignee_id = $1 AND t.status = 'pending' AND c.status != 'archived'
        AND NOT EXISTS (
          SELECT 1 FROM content_tasks earlier
           WHERE earlier.content_id = t.content_id
             AND earlier.status = 'pending'
             AND earlier.sort_order < t.sort_order
        )
      ORDER BY (t.due_at IS NULL) ASC, t.due_at ASC`,
    [memberId]
  );
  return rows;
}

module.exports = { createDefaultTasks, findByContentId, findById, complete, countPending, findForToday };
