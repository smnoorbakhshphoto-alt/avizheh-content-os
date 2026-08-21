const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { requireAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');

const todayController = require('../controllers/today.controller');
const contentController = require('../controllers/content.controller');
const ideaController = require('../controllers/idea.controller');

router.use(requireAuth);

router.get('/today', todayController.today);

router.get('/team', contentController.listTeam);

router.get('/content', contentController.list);
router.get('/content/:id', contentController.getOne);
router.post(
  '/content',
  [
    body('title').notEmpty().withMessage('موضوع محتوا الزامی است.'),
    body('contentType').isIn(['reel', 'post', 'story', 'carousel', 'photo']).withMessage('نوع محتوا نامعتبر است.'),
    validate,
  ],
  contentController.create
);
router.patch('/content/:id/publish', contentController.publish);

router.post('/tasks/:id/complete', contentController.completeTask);

router.get('/ideas', ideaController.list);
router.post('/ideas', [body('title').notEmpty().withMessage('متن ایده الزامی است.'), validate], ideaController.create);

module.exports = router;
