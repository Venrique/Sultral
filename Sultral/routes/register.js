var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');


router.get('/', function (req, res, next) {
    res.render('Registrar', { title: 'Sultral - Registrarse' });
});

router.post('/', function (req, res, next) {
    //verifica que no exista el correo en la base de datos
    Usuario.findOne({ email: req.body.correo })
        .exec()
        .then(email => {
            if (email) {

                return res.render('Registrar', { title: 'Sultral - Registrarse',errEmail: true,err: '*El correo se encuentra en uso por otro usuario.',usuario: req.body.usuario,correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm });
                /*return res.status(409).json({
                    message: 'El correo se encuentra en uso por otro usuario.'
                });*/
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

                            res.status(201).json({
                                message: "Se creo el usuario",
                                createdUser: usuario
                            });

                            return res.render('LogIn', { title: 'Sultral - Iniciar Sesión'});
                        }).catch(error => {
                            console.log(error);
                            return res.render('Registrar', { title: 'Sultral - Registrarse',err: '*No puede dejar campos vacíos.',usuario: req.body.usuario,correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm });
                        });
                    }
                });
            }
        })
});

module.exports = router;