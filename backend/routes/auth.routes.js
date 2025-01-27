const express = require('express');
const {
    registerParent,
    loginUser,
    addChildProfile,
    getChildProfiles,
} = require('../controllers/auth.controller');

const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/register', registerParent);
router.post('/login', loginUser);
router.post('/child', verifyToken, addChildProfile);
router.get("/children", verifyToken, getChildProfiles);

module.exports = router;