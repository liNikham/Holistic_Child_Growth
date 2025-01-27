const express = require('express');
const {
    registerParent,
    loginUser,
} = require('../controllers/authController');

const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/register', registerParent);
router.post('/login', loginUser);

module.exports = router;