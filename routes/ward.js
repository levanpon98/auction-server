var express = require('express');
var router = express.Router();
const WardController = require('../controllers/ward');

router.get('/:parent_code', WardController.get_ward);

module.exports = router;
