var express = require('express');
var router = express.Router();

const MenuController =require( '../controllers/menu')

router.get('/', MenuController.get_all_menu)
router.post('/', MenuController.create_menu)
router.patch('/:id', MenuController.update_menu)
router.delete('/:id', MenuController.delete_menu)

module.exports = router;