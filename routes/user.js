// routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { showUserData, getUserByEmail } = require('../controllers/userController');

router.get('/', auth, showUserData);
router.get('/:email', auth, getUserByEmail);

module.exports = router;
