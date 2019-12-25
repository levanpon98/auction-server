var express = require('express');
var router = express.Router();

const CartController = require('../controllers/cart')

router.post('/add_to_cart/:id', CartController.add_to_cart)

module.exports = router;
