const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const contentItemModel = require('../models/contentItem.model');
const contentTaskModel = require('../models/contentTask.model');
const contentIdeaModel = require('../models/contentIdea.model');
const teamMemberModel = require('../models/teamMember.model');

const CONTENT_TYPES = ['reel', 'post', 'story', 'carousel', 'photo'];

async function attachTasks(content) {
  const tasks = await contentTaskModel.findByContentId(content.id);
  const currentTask = tasks.find((t) => t.status === 'pending') || null;
  return { ...content, tasks, currentTask };
}

// GET /api/content?from=&to=
const list = asyncHandler(async (req, res) => {
  const items = await contentItemModel.findAll({ from: req.query.from, to: req.query.to });
  res.json({ success: true, data: items });
});

// GET /api/content/:id
const getOne = asyncHandler(async (req, res) => {
  const item = await contentItemModel.findById(req.params.id);
  if (!item) throw new AppError('محتوا یافت نشد.', 404, 'CONTENT_NOT_FOUND');
  res.json({ success: true, data: await attachTasks(item) });
});

// POST /api/content  (ثبت سریع)
const create = asyncHandler(async (req, res) => {
  const { title, contentType, scheduledAt, assigneeId, ideaId } = req.body;

  if (!title || !title.trim()) throw new AppError('موضوع محتوا الزامی است.', 422, 'TITLE_REQUIRED');
  if (!CONTENT_TYPES.includes(contentType)) throw new AppError('نوع محتوا نامعتبر است.', 422, 'INVALID_TYPE');

  const resolvedAssignee = assigneeId || req.member.id;
  const item = await contentItemModel.create({
    title: title.trim(),
    contentType,
    scheduledAt: scheduledAt || null,
    assigneeId: resolvedAssignee,
    createdBy: req.member.id,
    ideaId: ideaId || null,
  });

  await contentTaskModel.createDefaultTasks(item.id, {
    contentType,
    assigneeId: resolvedAssignee,
    dueAt: scheduledAt || null,
  });

  if (ideaId) await contentIdeaModel.markConverted(ideaId, item.id);

  const full = await contentItemModel.findById(item.id);
  res.status(201).json({ success: true, data: await attachTasks(full) });
});

// POST /api/tasks/:id/complete
const completeTask = asyncHandler(async (req, res) => {
  const task = await contentTaskModel.findById(req.params.id);
  if (!task) throw new AppError('کار یافت نشد.', 404, 'TASK_NOT_FOUND');
  if (task.status === 'done') throw new AppError('این کار قبلاً تکمیل شده است.', 409, 'TASK_ALREADY_COMPLETED');

  await contentTaskModel.complete(task.id);
  const pending = await contentTaskModel.countPending(task.content_id);
  if (pending === 0) await contentItemModel.setStatus(task.content_id, 'ready');

  const content = await contentItemModel.findById(task.content_id);
  res.json({ success: true, data: await attachTasks(content) });
});

// PATCH /api/content/:id/publish
const publish = asyncHandler(async (req, res) => {
  const item = await contentItemModel.findById(req.params.id);
  if (!item) throw new AppError('محتوا یافت نشد.', 404, 'CONTENT_NOT_FOUND');
  const updated = await contentItemModel.markPublished(item.id);
  res.json({ success: true, data: updated });
});

// GET /api/team
const listTeam = asyncHandler(async (req, res) => {
  const members = await teamMemberModel.findAll();
  res.json({ success: true, data: members });
});

module.exports = { list, getOne, create, completeTask, publish, listTeam };
