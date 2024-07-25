// Administator Routes
const express = require('express');

const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const router = express.Router();

// DATABASE CONNECTION
const db = require('../database/dbConnect');
const sql = require('../database/dbSQL');

// GET /administrator
router.get('/', (req, res) => {
    res.render('administrator/index');
});


module.exports = router;