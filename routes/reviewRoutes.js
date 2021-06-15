const express = require('express');

const router = express.Router({ mergeParams: true });

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

router.use(authController.protect);
router.route(`/`).get(reviewController.getAllUserReviews).post(reviewController.createUserReview);
router
    .route(`/:id`)
    .get(reviewController.getUserReview)
    .patch(reviewController.updateUserReview)
    .delete(reviewController.deleteUserReview);

router.use(authController.allowedTo('admin'));
router.route(`/`).get(reviewController.getAllReviews).post(reviewController.createReview);
router.route(`/:id`).patch(reviewController.updateReview).delete(reviewController.deleteReview);

module.exports = router;
