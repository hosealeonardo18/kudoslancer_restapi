const express = require('express');
const router = express.Router();
const jobseekerRouter = require('./jobseekerRouter');
const skillRouter = require('./skillRouter');
const experienceRouter = require('./experienceRouter');
const portfolioRouter = require('./portfolioRouter');
// const recruiterRouter = require('./recruiterRouter');


router.use('/jobseeker', jobseekerRouter);
router.use('/skill', skillRouter);
router.use('/experience', experienceRouter);
router.use('/portfolio', portfolioRouter);


module.exports = router;