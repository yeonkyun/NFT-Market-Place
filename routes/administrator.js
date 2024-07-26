// Administator Routes
const express = require('express');

const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const router = express.Router();

// DATABASE CONNECTION
const { queryDatabase } = require('../database/dbConnect');
const sql = require('../database/dbSQL');

// GET /administrator
router.get('/', async (req, res) => {
    try {
        const chartData = await queryDatabase(sql.getTransChart);
        res.render('administrator/index', { chartData: JSON.stringify(chartData) });
    } catch (err) {
        console.error(err);
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await queryDatabase(sql.getAllUser);
        res.render('administrator/users', { users });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;