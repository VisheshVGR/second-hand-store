const express = require('express');
const router = express.Router();
const authenticateUserMiddleware = require('../middleware/authentication');

const { login, register, profile } = require('../controllers/auth');

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/profile').get(authenticateUserMiddleware, profile);

module.exports = router;
