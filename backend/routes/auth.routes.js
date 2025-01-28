const express = require('express');
const auth = require('../controllers/auth.controller');

const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/register', auth.registerParent);
router.post('/login', auth.loginUser);
router.post('/child', verifyToken, auth.addChildProfile);
router.get("/children", verifyToken, auth.getChildProfiles);

module.exports = router;