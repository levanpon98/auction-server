var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/auth')

const path = require('path');



const ProductController = require('../controllers/product')

router.get('/', checkAuth, ProductController.products_get_all);
router.post('/', checkAuth,  ProductController.create_product);
router.get('/:id', checkAuth, ProductController.get_product_by_id);
router.patch("/:id", checkAuth, ProductController.update_product_by_id);
router.delete('/:id', checkAuth, ProductController.delete_product_by_id);

module.exports = router;
