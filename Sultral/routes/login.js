var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
    res.render('LogIn', { title: 'Sultral - Iniciar Sesión' });
});

router.post('/', function(req,res,next){
    Usuario.findOne({user: req.body.usuario}).exec()
    .then(user => {
        if(!user){
            return res.render('LogIn', { title: 'Sultral - Iniciar Sesión', err: '*Inicio de sesión fallido. Por favor revise sus credenciales.', usuario: req.body.usuario, pass: req.body.contrasenia});
        }

        bcrypt.compare(req.body.contrasenia, user.pass, (err, result) => {
            if(err){
                return res.render('LogIn', { title: 'Sultral - Iniciar Sesión', err: '*Inicio de sesión fallido. Por favor revise sus credenciales.', usuario: req.body.usuario, pass: req.body.contrasenia});
            }

            if(result){
                return res.render('Gestor', { title: 'Sultral - Gestor'});
            }

            return res.render('LogIn', { title: 'Sultral - Iniciar Sesión', err: '*Inicio de sesión fallido. Por favor revise sus credenciales.', usuario: req.body.usuario, pass: req.body.contrasenia});
        });
    })
    .catch(error => {
        console.log(error);
    });
});

module.exports = router;