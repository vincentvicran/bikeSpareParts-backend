const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const factory = require('./handlerFactory');

exports.getAllOrders = factory.getAll(Order);

exports.getAllUserOrders = catchAsync(async (req, res, next) => {
    const order = await Order.findById({ buyer: req.user.id });

    if (!order) {
        return next(new AppError('There is no order with the given ID!', 400));
    }

    res.status(200).json({
        status: 'success',
        results: order.length,
        message: 'Your orders have been found!',
        data: order,
    });
});

exports.getUserOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById({ buyer: req.user.id } && req.params.id);

    if (!order) {
        return next(new AppError('There is no order with the given ID!', 400));
    }

    res.status(200).json({
        status: 'success',
        message: 'Your order has been found!',
        data: order,
    });
});

exports.getOneOrder = factory.getOne(Order);

exports.createOrder = catchAsync(async (req, res, next) => {
    const order = await Order.create({
        buyer: req.user.id,
        product: req.params.productId,
        quantity: req.body.quantity,
        deliveryAddress: req.body.deliveryAddress,
        totalPrice: req.body.totalPrice,
    });

    if (!order) return next(new AppError('Your order could not be issued! Please try again!', 400));

    res.status(201).json({
        status: 'success',
        message: 'Your order has been issued!',
        data: order,
    });
});

exports.updateUserOrder = catchAsync(async (req, res, next) => {
    const testOrder = await Order.findById(req.params.id);
    const product = await Product.findById(testOrder.product._id);
    req.body.totalPrice = req.body.quantity * product.price;

    const order = await Order.findByIdAndUpdate({ buyer: req.user.id } && req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    // const order = await userOrder.findByIdAndUpdate(req.params.id, req.body);

    if (!order) {
        return next(new AppError('There is no order with the given ID!', 400));
    }

    res.status(200).json({
        status: 'success',
        message: 'Your order has been updated!',
        data: order,
    });
});

exports.updateOrder = factory.updateOne(Order);

exports.deleteUserOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndDelete({ buyer: req.user.id } && req.params.id);

    if (!order) {
        return next(new AppError('There is no order with the given ID!', 400));
    }

    res.status(200).json({
        status: 'success',
        message: 'Your order has been deleted!',
        data: null,
    });
});

exports.deleteOrder = factory.deleteOne(Order);
