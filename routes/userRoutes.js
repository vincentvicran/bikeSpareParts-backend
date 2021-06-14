const express = require('express');

const router = express.Router({ mergeParams: true });

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
router.route('/updateme').patch(userController.updateMe);
router.route('/deleteme').delete(userController.deleteMe);

router.use(authController.allowedTo('admin'));
router.route('/').get(userController.getAllUsers);
router.route('/:id').get(userController.getOneUser);
router.route('/').post(userController.createUser);
router.route('/:id').patch(userController.updateUser);
router.route('/:id').delete(userController.deleteUser);

module.exports = router;
