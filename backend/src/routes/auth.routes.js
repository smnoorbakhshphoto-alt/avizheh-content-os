const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');

router.post(
  '/login',
  [body('username').notEmpty(), body('password').notEmpty(), validate],
  authController.login
);
router.get('/me', requireAuth, authController.me);

module.exports = router;
