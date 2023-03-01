const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id }).sort(
    'createdAt'
  );
  res.status(StatusCodes.OK).json({ products });
};

const getProduct = async (req, res) => {
  const {
    user: { ['_id']: userId },
    params: { id: productId },
  } = req;

  const product = await Product.find({ createdBy: userId, _id: productId });

  if (!product || !product[0]) {
    throw new NotFoundError(`No product with id ${productId} exists.`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const createProduct = async (req, res) => {
  req.body.createdBy = req.user._id;

  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

const updateProduct = async (req, res) => {
  const {
    body: { name, price, description },
    user: { _id: userId },
    params: { id: productId },
  } = req;

  if (name === '' || price === '' || description === '') {
    throw new BadRequestError(
      'Name or Price or Description fields cannot be empty.'
    );
  }

  const product = await Product.findByIdAndUpdate(
    { _id: productId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new NotFoundError(`No product with id ${productId} exists.`);
  }

  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const {
    user: { _id: userId },
    params: { id: productId },
  } = req;

  const product = await Product.findByIdAndRemove({
    _id: productId,
    createdBy: userId,
  });

  if (!product) {
    throw new NotFoundError(`No product with id ${productId} exists.`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
