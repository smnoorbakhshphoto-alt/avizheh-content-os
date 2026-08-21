const asyncHandler = require('../utils/asyncHandler');
const contentTaskModel = require('../models/contentTask.model');
const contentItemModel = require('../models/contentItem.model');

function isToday(date) {
  const d = new Date(date);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

// GET /api/today
const today = asyncHandler(async (req, res) => {
  const myTasks = await contentTaskModel.findForToday(req.member.id);

  const needsAction = myTasks.filter((t) => t.is_overdue);
  const dueToday = myTasks.filter((t) => !t.is_overdue && t.due_at && isToday(t.due_at));
  const upcoming = myTasks.filter((t) => !t.is_overdue && (!t.due_at || !isToday(t.due_at)));

  const readyToPublish = await contentItemModel.findReadyToPublish();

  res.json({ success: true, data: { needsAction, dueToday, upcoming, readyToPublish } });
});

module.exports = { today };
