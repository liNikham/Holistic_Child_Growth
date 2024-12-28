const express = require('express');
const {
    registerParent,
    loginUser,
    addChildProfile,
    getChildProfiles,
} = require('../controllers/authController');

const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/register', registerParent);
router.post('/login', loginUser);
router.post('/child', verifyToken, restrictTo('parent'), addChildProfile);
router.get("/children",verifyToken,restrictTo("parent"),getChildProfiles);

module.exports = router;