var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', function (req, res, next) {
    res.render('LogIn', { title: 'Sultral - Iniciar Sesión' });
});

router.post('/', function (req, res, next) {
    Usuario.findOne({ user: req.body.usuario }).exec()
        .then(user => {
            if (!user) {
                return res.status(400).render('LogIn', { title: 'Sultral - Iniciar Sesión', err: '*Inicio de sesión fallido. Por favor revise sus credenciales.', usuario: req.body.usuario, pass: req.body.contrasenia });
            }

            bcrypt.compare(req.body.contrasenia, user.pass, (err, result) => {
                if (err) {
                    return res.status(400).render('LogIn', { title: 'Sultral - Iniciar Sesión', err: '*Inicio de sesión fallido. Por favor revise sus credenciales.', usuario: req.body.usuario, pass: req.body.contrasenia });
                }

                if (result) {
                    const token = jwt.sign({
                        usuario: user.user,
                        correo: user.email,
                        Id: user._id
                    }, process.env.JWT_KEY,
                        {
                            expiresIn: "1d"
                        });
                    //console.log(token);
                    return res.status(200).cookie('token',token,{ maxAge: 86400000 }).redirect('Gestor');
                }

                return res.status(400).render('LogIn', { title: 'Sultral - Iniciar Sesión', err: '*Inicio de sesión fallido. Por favor revise sus credenciales.', usuario: req.body.usuario, pass: req.body.contrasenia });
            });
        })
        .catch(error => {
            console.log(error);
        });
});

module.exports = router;