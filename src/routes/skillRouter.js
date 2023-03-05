const express = require('express');
const router = express.Router();
const skillsController = require('../controller/skillsController');
// const {
//   protect
// } = require('../middleware/AuthMiddleware');
// const upload = require('../middleware/MulterMiddleware');

// getData
router.get('/', skillsController.getAllSkill);
// router.get('/:id', jobseekersController.getDetailJobseeker);
// router.put('/:id', protect, upload, jobseekersController.updateJobseeker);
// router.delete('/:id', jobseekersController.deleteJobseekers);



module.exports = router;