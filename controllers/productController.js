const multer = require('multer');
const sharp = require('sharp');

const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');

const Product = require('../models/productModel');

const factory = require('./handlerFactory');

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

exports.uploadProductPhoto = upload.array('images', 3);

exports.resizeProductPhoto = catchAsync(async (req, res, next) => {
    if (!req.files) return next(new AppError('No files detected! Please insert an image!'));

    req.body.images = [];

    await Promise.all(
        req.files.map(async (file, i) => {
            const filename = `product-${req.body.name}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(800, 640)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/products/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
});

exports.getAllProducts = factory.getAll(Product);

exports.getOneProduct = factory.getOne(Product, 'reviews');

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
