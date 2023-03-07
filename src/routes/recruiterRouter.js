const express = require('express');
const router = express.Router();
const recruitersController = require('../controller/recruitersController');
const {
  protect
} = require('../middleware/AuthMiddleware');
const upload = require('../middleware/MulterMiddleware');

// getData
router.get('/', recruitersController.getAllRecruiter);
router.get('/:id', recruitersController.getDetailRecruiter);
router.put('/:id', protect, upload, recruitersController.updateRecruiter);
router.delete('/:id', recruitersController.deleteRecruiter);

// // auth
router.post('/auth/register', recruitersController.registerRecruiters);
router.post('/auth/login', recruitersController.loginRecruiters);
router.post('/auth/refresh-token', recruitersController.refreshTokenRecruiters);

module.exports = router;