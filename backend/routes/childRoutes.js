const express = require('express');
const router = express.Router();
const childController = require('../controllers/childController'); // Import the controller
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');
// Route to create a child profile
router.post('/createChildProfile',verifyToken, childController.createChildProfile);

// Route to get all child profiles for a parent
router.get('/getAllChildProfiles', verifyToken,childController.getAllChildProfiles);

// Add more routes as needed
module.exports = router;
