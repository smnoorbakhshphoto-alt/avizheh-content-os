const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const teamMemberModel = require('../models/teamMember.model');
const { signToken } = require('../utils/jwt');
const passwordUtil = require('../utils/password');

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const member = await teamMemberModel.findByUsernameInternal(username);
  if (!member || !passwordUtil.verifyPassword(password, member.password_hash)) {
    throw new AppError('نام کاربری یا رمز عبور اشتباه است.', 401, 'INVALID_CREDENTIALS');
  }
  const token = signToken({ memberId: member.id });
  delete member.password_hash;
  res.json({ success: true, data: { token, member } });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { member: req.member } });
});

module.exports = { login, me };
