const express = require('express');

const route = express.Router();

const authRoutes = require('./auth.routes');
const dailyCaptureRoutes = require('./dailyCapture.routes');

route.use('/users', authRoutes);
route.use('/dailyCapture', dailyCaptureRoutes);

module.exports = route;
