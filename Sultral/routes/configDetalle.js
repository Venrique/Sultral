var express = require('express');

var router = express.Router();
const Usuario = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

router.get('/', function(req, res, next) {
    const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
    Usuario.find({_id: mongoose.Types.ObjectId(decode.Id)})
    .exec().then((result) => {
        res.render('ConfigDetalle', { title: 'Configuracion Usuario', max: result[0]['maxstorage'], utilizado: result[0]['storage']});
    });
    
});


module.exports = router;