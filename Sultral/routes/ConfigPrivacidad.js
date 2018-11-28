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

    if (req.body.nueva  && req.body.confirmacion && req.body.anterior) {
        if (req.body.nueva == req.body.confirmacion) {
            Usuario.findOne({ pass: req.body.anterior})
                .exec()
                .then(pass => {
                    if (pass) {
                        bcrypt.hash(req.body.nueva, 10, (err, hash) => {
                            //si da error el encriptado
                            Usuario.findOneAndUpdate({ user: decode.usuario }, { pass: hash }, function (err, place) {

                            });

                        });
                        return res.render('ConfigPrivacidad', { title: 'Configuracion Usuario', acept: "Contraseña actualizada correctamente" });

                    } else {
                        return res.render('ConfigPrivacidad', { title: 'Configuracion Usuario', err: "La contraseña actual no coincide con la que usted ingreso en el campo de contraseña actual" });



                    }
                });
        } else {

            return res.render('ConfigPrivacidad', { title: 'Configuracion Usuario', err: "La contraseña nueva no coincide con la que usted esta ingresando en la confirmacion" });
        }
    } else {
        return res.render('ConfigPrivacidad', { title: 'Configuracion Usuario', err: "No pueden quedar campos vacios" });

    }
});

module.exports = router;