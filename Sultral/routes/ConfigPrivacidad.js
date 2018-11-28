var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



/* GET home page. */
router.get('/', function (req, res, next) {

    res.render('ConfigPrivacidad', { title: 'Configuracion de privacidad del usuario' });


});

router.post('/', function (req, res, next) {
    const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

    if (req.body.nueva && req.body.confirmacion && req.body.anterior) {
        if (req.body.nueva == req.body.confirmacion) {
            Usuario.findOne({ user: decode.usuario }).exec()
            .then(user => {
                bcrypt.compare(req.body.anterior, user.pass, function(err, result) {
                    if (result) {
                        //console.log(token);
                        bcrypt.hash(req.body.nueva, 10, (err, hash) => { 
                            Usuario.findOneAndUpdate({user: decode.usuario}, {pass:hash}, function(err, place){

                            });
                        });
                        return res.render('ConfigPrivacidad', { title: 'Configuracion Usuario', acept: "Se actualizo la contraseña" });
        
                    
                    }else{
                        return res.render('ConfigPrivacidad', { title: 'Configuracion Usuario', err: "La contraseña especificada como actual no es la actual" });
        
                    }
    
                  });
            });
        } else {

            return res.render('ConfigPrivacidad', { title: 'Configuracion Usuario', err: "La contraseña nueva no coincide con la que usted esta ingresando en la confirmacion" });
        }
    } else {
        return res.render('ConfigPrivacidad', { title: 'Configuracion Usuario', err: "No pueden quedar campos vacios" });

    }
});

module.exports = router;