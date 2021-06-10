const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);

router.use(authController.protect);
router.route('/me').get(userController.getMe);
router.route('/updatepassword').patch(authController.updatePassword);
router.route('/logout').get(authController.logout);

module.exports = router;
