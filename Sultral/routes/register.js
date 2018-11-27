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
    let genero = "Masculino";
    let flag = false;
    if(req.body.genero == "Femenino"){
        genero = "Femenino";
        flag = true;
    }
    //Verifica que las contraseñas coincidan
    if (req.body.contrasenia != req.body.confirm) {
        return res.status(400).render('Registrar', { title: 'Sultral - Registrarse', errPass: true, err: '*Las contraseñas no coinciden.', usuario: req.body.usuario, correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm, nombres: req.body.nombres, apellidos: req.body.apellidos, fecha: req.body.fechaNac, gen: flag });
    }else if(!regexPass.test(req.body.contrasenia)){
        return res.status(400).render('Registrar', { title: 'Sultral - Registrarse', errPass: true, err: '*La contraseña debe poseer mínimo 8 caracteres, una letra y un numero.', usuario: req.body.usuario, correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm, nombres: req.body.nombres, apellidos: req.body.apellidos, fecha: req.body.fechaNac, gen: flag });
    } else {
        //verifica que no exista el correo en la base de datos
        Usuario.findOne({ email: req.body.correo })
            .exec()
            .then(email => {
                if (email) {

                    return res.status(403).render('Registrar', { title: 'Sultral - Registrarse', errEmail: true, err: '*El correo ya está registrado.', usuario: req.body.usuario, correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm, nombres: req.body.nombres, apellidos: req.body.apellidos, fecha: req.body.fechaNac, gen: flag });

                } else {
                    //verifica que no exista el usuario en la base de datos
                    Usuario.findOne({ user: req.body.usuario }).exec().then(user => {
                        if (user) {
                            return res.status(403).render('Registrar', { title: 'Sultral - Registrarse', errUser: true, err: '*El usuario no está disponible.', usuario: req.body.usuario, correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm, nombres: req.body.nombres, apellidos: req.body.apellidos, fecha: req.body.fechaNac, gen: flag });
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
                                        user: req.body.usuario.trim(),
                                        email: req.body.correo.trim(),
                                        pass: hash,
                                        names: req.body.nombres.trim(),
                                        lastnames: req.body.apellidos.trim(),
                                        birthdate: new Date(req.body.fechaNac),
                                        gender: genero
                                    });
                                    //se guarda el usuario en la base de datos
                                    usuario.save().then(result => {
                                        console.log(result);
                                        return res.status(200).redirect('LogIn');
                                    }).catch(error => {
                                        console.log(error);
                                        return res.status(400).render('Registrar', {
                                            title: 'Sultral - Registrarse',
                                            err: '*Error de validación. Por favor revise que todos los campos estén completos y que la contraseña posea mínimo 8 caracteres y por lo menos una letra y un número.',
                                            usuario: req.body.usuario, correo: req.body.correo, pass: req.body.contrasenia, passconfirm: req.body.confirm, nombres: req.body.nombres, apellidos: req.body.apellidos, fecha: req.body.fechaNac, gen: flag
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