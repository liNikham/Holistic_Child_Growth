const express = require('express');
const childActivity = require('../controllers/childActivity.controller'); // Import the controller
const geminiService = require('../utils/geminiService');
const { verifyToken } = require('../middleware/authMiddleware');
// Route to create a child profile

const router = express.Router();

router.post('/createChildProfile', verifyToken, childActivity.createChildProfile);
router.get('/getAllChildProfiles', verifyToken, childActivity.getAllChildProfiles);
router.post('/addActivity', verifyToken, childActivity.addActivity);
router.get('/getActivities/:childId', verifyToken, childActivity.getActivitiesByChildId);
router.post('/performAnalysis', verifyToken, geminiService.generateAnalysis);

// Add more routes as needed
module.exports = router;
