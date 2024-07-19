// routes/borrow.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { borrowMoney } = require('../controllers/borrowController');

router.post('/', auth, borrowMoney);

module.exports = router;
