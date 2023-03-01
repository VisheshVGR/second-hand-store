const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllCatalogueProducts = async (req, res) => {
  const { featured, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }

  // if (company) {
  //   queryObject.company = company;
  // }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  if (numericFilters) {
    // numericFilters = price>50,rating>=4
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    // filters = price-$gt-50,rating-$gte-4
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      // item = price-$gt-50
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);

  // Sorting
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  // Selecting fields to return
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  // Implementing pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result.populate('createdBy', 'name email');
  res.status(StatusCodes.OK).json({ products });
};

const getCatalogueProduct = async (req, res) => {
  const { id: productID } = req.params;

  const products = await Product.find({ _id: productID }).populate(
    'createdBy',
    '-password'
  );

  if (!products) {
    throw new NotFoundError(`No product with id ${productId} exists.`);
  }

  res
    .status(StatusCodes.OK)
    .json({ products })
    .populate('createdBy', 'name email');
};

module.exports = {
  getAllCatalogueProducts,
  getCatalogueProduct,
};
