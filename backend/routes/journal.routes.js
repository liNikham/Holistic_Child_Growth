const express = require('express');
const router = express.Router();

const journalController = require('../controllers/journal.controller');

router.post('/query', journalController.queryToJournal);

module.exports = router;