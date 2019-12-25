var express = require('express');
var router = express.Router();
const DistrictController = require('../controllers/district');

router.get('/:parent_code', DistrictController.get_district);

module.exports = router;
