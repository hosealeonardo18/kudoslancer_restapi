const express = require('express');
const router = express.Router();
const skillsController = require('../controller/skillsController');
const { protect } = require('../middleware/AuthMiddleware');

// getData
router.get('/', skillsController.getAllSkill);
router.get('/:id', skillsController.getDetailSkill);
router.post('/', skillsController.createSkill)
router.put('/:id', skillsController.updateSkill);
router.delete('/:id', skillsController.deleteSkill);

// Get Data skill by Jobseeker
router.post('/jobseekerId', protect, skillsController.createJobseekerSkill)
router.get('/detail/jobseekerId', protect, skillsController.detailJobseekerSkill);
router.get('/detail/jobseekerId/:id', skillsController.getDetailJobseekerSkill);


module.exports = router;