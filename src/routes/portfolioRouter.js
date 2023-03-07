const express = require('express');
const router = express.Router();
const portfoliosController = require('../controller/portfoliosController');
const {
  protect
} = require('../middleware/AuthMiddleware');
const upload = require('../middleware/MulterMiddleware');

// getData
router.get('/', portfoliosController.getAllPortfolio);
router.post('/', protect, upload, portfoliosController.createPortfolio)
router.get('/:id', portfoliosController.getDetailPortfolio);
router.put('/:id', protect, upload, portfoliosController.updatePortfolio);
router.delete('/:id', protect, portfoliosController.deletePortfolio);

router.get('/detail/jobseeker/:id', portfoliosController.getDetailPortfolioJobseeker);

module.exports = router;