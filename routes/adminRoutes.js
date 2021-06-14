const express = require('express');

const router = express.Router({ mergeParams: true });

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
// const orderRoutes = require('./orderRoutes');
// const reviewRoutes = require('./reviewRoutes');

const authController = require('../controllers/authController');

router.use(authController.protect, authController.allowedTo('admin'));

router.use(`/users`, userRoutes);
router.use(`/products`, productRoutes);
// router.use(`/orders`, orderRoutes);
// router.use(`/reviews`, reviewRoutes);

router.route('/addAdmin').post(authController.addAdmin);

module.exports = router;
