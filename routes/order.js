var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/auth')

const OrderController =require( '../controllers/order')

router.get('/', checkAuth, OrderController.get_all_orders);
router.post('/', checkAuth, OrderController.create_order)


module.exports = router;