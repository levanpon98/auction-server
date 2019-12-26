const path = require('path');
const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const upload = require('express-fileupload');

app.use(upload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

var cors = require ('cors');

app.use(cors({
    origin:['http://localhost:4200','http://127.0.0.1:4200'],
    credentials:true
}));

var productsRouter = require('./routes/product');
var orderRouter = require('./routes/order');
var usersRouter = require('./routes/user');
var menuRouter = require('./routes/menu');
var districtRouter = require('./routes/district');
var wardRouter = require('./routes/ward');
var provinceRouter = require('./routes/province');
var addressRouter = require('./routes/address');
var adminRouter = require('./routes/admin');

mongoose.connect(
    'mongodb+srv://khmtgroup02:' +
     process.env.MONGO_ATLAS_PW + 
     '@cluster0-zwf9v.mongodb.net/khmtgroup02?retryWrites=true&w=majority',
     { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
    res.header('Access-Control-Allow-Credentials', true);
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/api/product', productsRouter);
app.use('/api/user', usersRouter);
app.use('/api/order', orderRouter);
app.use('/api/menu', menuRouter);
app.use('/api/district', districtRouter);
app.use('/api/ward', wardRouter);
app.use('/api/province', provinceRouter);
app.use('/api/address', addressRouter);
app.use('/api/admin', adminRouter);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
         error : {
            message: error.message
        }})
});
module.exports = app;
