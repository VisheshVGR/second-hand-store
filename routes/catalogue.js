const express = require('express');
const router = express.Router();

const {
  getAllCatalogueProducts,
  getCatalogueProduct,
} = require('../controllers/catalogue');

router.route('/').get(getAllCatalogueProducts);
router.route('/:id').get(getCatalogueProduct);

module.exports = router;
