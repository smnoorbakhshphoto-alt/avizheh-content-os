const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const teamMemberModel = require('../models/teamMember.model');

const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('برای دسترسی باید وارد حساب کاربری شوید.', 401, 'UNAUTHENTICATED');
  }

  const token = header.split(' ')[1];
  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    throw new AppError('توکن نامعتبر یا منقضی شده است.', 401, 'INVALID_TOKEN');
  }

  const member = await teamMemberModel.findById(payload.memberId);
  if (!member) throw new AppError('کاربر یافت نشد.', 401, 'USER_NOT_FOUND');

  req.member = member;
  next();
});

const requireAdmin = (req, res, next) => {
  if (req.member?.role !== 'admin') {
    throw new AppError('این بخش فقط برای مدیران است.', 403, 'FORBIDDEN');
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
