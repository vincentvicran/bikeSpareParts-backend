const multer = require('multer');
const sharp = require('sharp');

const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');

const Product = require('../models/productModel');

const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, `public/img/products`);
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `product-${req.user.id}-${Date.now()}.${ext}`);
//     },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadProductPhoto = upload.single('photo');

exports.resizeProductPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `product-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
        .resize(800, 640)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${req.file.filename}`);

    next();
});

exports.getAllProducts = factory.getAll(Product);

exports.getOneProduct = factory.getOne(Product);

// exports.createProduct = factory.createOne(Product);

exports.createProduct = catchAsync(async (req, res, next) => {
    const product = await Product.create({
        name: req.body.name,
        description: req.body.description,
        images:,
        category: req.body.category,
        price: req.body.price,
        brand: req.body.brand,
        vehicle: req.body.vehicle,
        review: req.body.review,
        color: req.body.color,
        isAvailable: req.body.isAvailable
    })
});

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
