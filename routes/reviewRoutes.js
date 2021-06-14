const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

router.use(authController.protect);

module.exports = router;
