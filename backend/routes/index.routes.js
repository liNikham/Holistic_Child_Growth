const express = require('express');

const route = express.Router();

const authRoutes = require('./auth.routes');
const dailyCaptureRoutes = require('./dailyCapture.routes');
const childRoutes = require('./child.routes');

route.use('/users', authRoutes);
route.use('/dailyCapture', dailyCaptureRoutes);
route.use('/child', childRoutes);

module.exports = route;
