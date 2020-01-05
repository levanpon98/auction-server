var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/auth');

const OrderController = require('../controllers/order');

router.get('/', checkAuth, OrderController.get_all_orders);
router.get('/:id', checkAuth, OrderController.get_order_by_user_id);
router.post('/', checkAuth, OrderController.create_order);


module.exports = router;
