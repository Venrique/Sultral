var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');

const regexPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/;

router.get('/', function (req, res, next) {
    res.render('Registrar', { title: 'Sultral - Registrarse' });
});

router.post('/', function (req, res, next) {
    //Verifica que las contraseñas coincidan
    if (req.body.contrasenia != req.body.confirm) {
        return res.render('Registrar', { title: 'Sultral - Registrarse', errPass: true, err: '*Las contraseñas no coinciden.', usuario: req.body.usuario, correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm });
    }else if(!regexPass.test(req.body.contrasenia)){
        return res.render('Registrar', { title: 'Sultral - Registrarse', errPass: true, err: '*La contraseña debe poseer mínimo 8 caracteres, una letra y un numero.', usuario: req.body.usuario, correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm });
    } else {
        //verifica que no exista el correo en la base de datos
        Usuario.findOne({ email: req.body.correo })
            .exec()
            .then(email => {
                if (email) {

                    return res.render('Registrar', { title: 'Sultral - Registrarse', errEmail: true, err: '*El correo ya está registrado.', usuario: req.body.usuario, correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm });

                } else {
                    //verifica que no exista el usuario en la base de datos
                    Usuario.findOne({ user: req.body.usuario }).exec().then(user => {
                        if (user) {
                            return res.render('Registrar', { title: 'Sultral - Registrarse', errUser: true, err: '*El usuario no está disponible.', usuario: req.body.usuario, correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm });
                        } else {
                            //se encripta la contrasenia
                            bcrypt.hash(req.body.contrasenia, 10, (err, hash) => {
                                //si da error el encriptado
                                if (err) {
                                    return res.status(500).json({
                                        error: err
                                    });
                                    //se crea el usuario usando el modelo
                                } else {
                                    const usuario = new Usuario({
                                        _id: new mongoose.Types.ObjectId(),
                                        user: req.body.usuario,
                                        email: req.body.correo,
                                        pass: hash
                                    });
                                    //se guarda el usuario en la base de datos
                                    usuario.save().then(result => {
                                        console.log(result);
                                        return res.render('LogIn', { title: 'Sultral - Iniciar Sesión' });
                                    }).catch(error => {
                                        console.log(error);
                                        return res.render('Registrar', {
                                            title: 'Sultral - Registrarse',
                                            err: '*Error de validación. Por favor revise que todos los campos estén completos y que la contraseña posea mínimo 8 caracteres y por lo menos una letra y un número.',
                                            usuario: req.body.usuario, correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
    }
});

module.exports = router;