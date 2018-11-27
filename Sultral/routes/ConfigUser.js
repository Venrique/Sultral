var express = require('express');

var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');


router.get('/', function(req, res, next) {
    //console.log(req.params.hola);
    res.render('Config-usuario', { title: 'Configuracion Usuario' });
});

router.post('/', function (req, res, next) {

    bcrypt.hash(req.body.nueva, 10, (err, hash) => {
        //si da error el encriptado
        Usuario.findOneAndUpdate({user: "ricardoDef"}, {pass: hash}, function (err, place) {
            res.send(place);
            console.log(place.pass);
          });
    
            });

 


 });
module.exports = router;