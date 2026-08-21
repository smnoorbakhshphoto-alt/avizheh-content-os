const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const ideaModel = require('../models/contentIdea.model');

// GET /api/ideas
const list = asyncHandler(async (req, res) => {
  const ideas = await ideaModel.findAll();
  res.json({ success: true, data: ideas });
});

// POST /api/ideas
const create = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) throw new AppError('متن ایده الزامی است.', 422, 'TITLE_REQUIRED');
  const idea = await ideaModel.create({ title: title.trim(), createdBy: req.member.id });
  res.status(201).json({ success: true, data: idea });
});

module.exports = { list, create };
