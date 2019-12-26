var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/auth');

const AdminController =require( '../controllers/admin');

router.post('/login', AdminController.login);


module.exports = router;
