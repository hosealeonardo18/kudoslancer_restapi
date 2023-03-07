const express = require('express');
const router = express.Router();
const experiencesController = require('../controller/experiencesController');
const {
  protect
} = require('../middleware/AuthMiddleware');
const upload = require('../middleware/MulterMiddleware');

// getData
router.get('/', experiencesController.getAllExperience);
router.post('/', protect, upload, experiencesController.createExperience)
router.get('/:id', experiencesController.getDetailExperience);
router.put('/:id', protect, upload, experiencesController.updateExperience);
router.delete('/:id', protect, experiencesController.deleteExperiences);

router.get('/detail/jobseeker/:id', experiencesController.getDetailExperienceJobseeker);



module.exports = router;