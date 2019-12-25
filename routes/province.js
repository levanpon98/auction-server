var express = require('express');
var router = express.Router();
const ProvinceController = require('../controllers/province');

router.get('/', ProvinceController.get_all_provinces);

module.exports = router;
