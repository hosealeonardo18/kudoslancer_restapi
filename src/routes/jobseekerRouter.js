const express = require('express');
const router = express.Router();
const jobseekersController = require('../controller/jobseekersController');
const {
  protect
} = require('../middleware/AuthMiddleware');
const upload = require('../middleware/MulterMiddleware');

// getData
router.get('/', jobseekersController.getAllJobseeker);
router.get('/:id', jobseekersController.getDetailJobseeker);
router.put('/:id', protect, upload, jobseekersController.updateJobseeker);
router.delete('/:id', jobseekersController.deleteJobseekers);

// // auth
router.post('/auth/register', jobseekersController.registerJobseekers);
router.post('/auth/login', jobseekersController.loginJobseekers);
router.post('/auth/refresh-token', jobseekersController.refreshTokenJobseekers);

module.exports = router;