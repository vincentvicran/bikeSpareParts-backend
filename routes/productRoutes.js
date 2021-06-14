const express = require('express');

const router = express.Router({ mergeParams: true });

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const orderRoutes = require('./orderRoutes');
// const reviewRoutes = require('./reviewRoutes');

router.route('/').get(productController.getAllProducts);
router.route(`/:id`).get(productController.getOneProduct);

router.use(authController.protect);
router.use(`/:productId/orders`, orderRoutes);
// router.use(`/:productId/reviews`, reviewRoutes);

router.use(authController.allowedTo('admin'));
router
    .route('/')
    .post(productController.uploadProductPhoto, productController.resizeProductPhoto, productController.createProduct);
router
    .route(`/:id`)
    .patch(productController.uploadProductPhoto, productController.resizeProductPhoto, productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;
