var express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/auth');

const UserController =require( '../controllers/user');

router.post('/login', UserController.login);
router.get('/check-token', UserController.check_token);
router.post('/register', UserController.signup);
router.delete('/:id', UserController.delete);
router.get('/:id', checkAuth, UserController.get_user_by_id);
router.get('/', UserController.get_all_user);
router.get('/view-profile/:id', checkAuth, UserController.get_user_for_view);
router.patch('/:id', checkAuth, UserController.update_user_by_id);
router.post("/forgot-password", UserController.forgot_password);
router.post("/reset-password", UserController.reset_password);
router.patch("/change-password/:id",checkAuth, UserController.change_password);
module.exports = router;
