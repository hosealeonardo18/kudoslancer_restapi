const express = require('express');
const router = express.Router();
const jobseekerRouter = require('./jobseekerRouter');
// const portfolioRouter = require('./portfolioRouter');
// const recruiterRouter = require('./recruiterRouter');
// const experienceRouter = require('./experienceRouter');


router.use('/jobseeker', jobseekerRouter);
// router.use('/recruiter', recruiterRouter);
// router.use('/portfolio', portfolioRouter);
// router.use('/experience', experienceRouter);


module.exports = router;