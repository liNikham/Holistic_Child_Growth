const express = require('express');

const route = express.Router();

const authRoutes = require('./auth.routes');
const childRoutes = require('./child.routes');
const journalRoutes = require('./journal.routes');

route.use('/users', authRoutes);
route.use('/child', childRoutes);
route.use('/journal', journalRoutes);

module.exports = route;
