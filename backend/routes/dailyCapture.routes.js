const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");
const dailyCapture = require("../controllers/dailyCapture.controller");
const router = express.Router();

router.get("/", verifyToken, dailyCapture.capturedData);
router.post("/", verifyToken, dailyCapture.captureData);
router.put("/updateCapture", verifyToken, dailyCapture.updateCapturedData);

module.exports = router;