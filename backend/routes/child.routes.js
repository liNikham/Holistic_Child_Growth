const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController'); // Import the controller
const openai = require('../utils/openAiService');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');
// Route to create a child profile
router.post('/createChildProfile',verifyToken, childController.createChildProfile);

// Route to get all child profiles for a parent
router.get('/getAllChildProfiles', verifyToken,childController.getAllChildProfiles);
router.post('/addActivity',verifyToken,childController.addActivity);
router.get('/getActivities/:childId', verifyToken, childController.getActivitiesByChildId); 
router.post('/performAnalysis',verifyToken,openai.generateAnalysis);

// Add more routes as needed
module.exports = router;
