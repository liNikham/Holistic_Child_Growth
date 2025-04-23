const express = require('express');
const childActivity = require('../controllers/childActivity.controller'); // Import the controller
const geminiService = require('../utils/geminiService');
const { verifyToken } = require('../middleware/authMiddleware');
const recommendationController = require('../controllers/recommendationController');
const parentQueryController = require('../controllers/parentQueryController');
const whoController = require('../controllers/whostandard.controller'); // Import the controller for weight-for-age
// Route to create a child profile

const router = express.Router();
router.post('/categorize', verifyToken, geminiService.categorizeActivity);
router.post('/createChildProfile', verifyToken, childActivity.createChildProfile);
router.get('/getAllChildProfiles', verifyToken, childActivity.getAllChildProfiles);
router.post('/addActivity', verifyToken, childActivity.addActivity);
router.get('/getActivities/:childId', verifyToken, childActivity.getActivitiesByChildId);
router.post('/performAnalysis', verifyToken, geminiService.generateAnalysis);
router.get('/generateMonthlySummary', verifyToken, childActivity.generateMonthlySummary);
router.get('/categorizedActivities', verifyToken, geminiService.categorizeActivitiesUsingGemini);
router.get('/getRecommendations/:childId', verifyToken, recommendationController.getRecommendations);
router.get('/journal/:childId', verifyToken, recommendationController.getJournalEntriesByChildId);
router.post('/parent-queries/ask', verifyToken, parentQueryController.askQuestion);
router.get('/weight_for_age/:childId', verifyToken, whoController.wfa)
router.get('/weight_for_height/:childId', verifyToken, whoController.wfh)
router.get('/length_height_for_age/:childId', verifyToken, whoController.lhfa);
router.get('/bmi_for_age/:childId', verifyToken, whoController.bfa);
router.post('/updateMeasurements', verifyToken, childActivity.updateChildMeasurements);

// Add more routes as needed
module.exports = router;
