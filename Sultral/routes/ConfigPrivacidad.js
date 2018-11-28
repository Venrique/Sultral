var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');



/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('ConfigPrivacidad', { title: 'Configuracion de privacidad del usuario'});
  

});

router.post('/', function (req, res, next) {
    if(req.body.nueva && req.body.confirmacion){
        if(req.body.nueva == req.body.confirmacion){
            bcrypt.hash(req.body.nueva, 10, (err, hash) => {
                //si da error el encriptado
                Usuario.findOneAndUpdate({user: "RicardoAlberto"}, {pass: hash}, function (err, place) {
                    res.send(place);
                    console.log(place.pass);
                  });
            
                    });

        }else{
            console.log("Las contraseñas no coinciden");
            return res.render('ConfigPrivacidad', { title: 'Configuracion Usuario' , err: "La contraseña nueva no coincide con la que usted esta ingresando en la confirmacion"});
        }
    }
    

 


 });

module.exports = router;