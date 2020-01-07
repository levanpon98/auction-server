var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/auth')

const AddressController = require('../controllers/address');

router.get('/:user_id', checkAuth, AddressController.get_all_addresses);
router.post('/:user_id', checkAuth, AddressController.create_address);
router.get('/:user_id/:id', checkAuth, AddressController.get_address_by_id);
router.patch("/:user_id/:id", checkAuth, AddressController.update_address_by_id);
router.delete('/:user_id/:id', checkAuth, AddressController.delete_address_by_id);

module.exports = router;
