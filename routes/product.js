var express = require('express');
var router = express.Router();
const path = require('path');
const checkAuth = require('../middleware/auth');
const multer = require('multer');
const ProductController = require('../controllers/product');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/',  ProductController.products_get_all);
router.post('/', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 3 }
]), ProductController.create_product);
router.get('/:id',  ProductController.get_product_by_id);
router.patch("/:id", checkAuth, ProductController.update_product_by_id);
router.delete('/:id', checkAuth, ProductController.delete_product_by_id);

module.exports = router;
