var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



/* GET home page. */
router.get('/', function (req, res, next) {
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  res.render('ConfigInfoUsuario', { title: 'Configuracion de informacion del usuario' });


});

router.post('/', function (req, res, next) {
  var nombre = req.body.Nombre.trim();
  var apellido = req.body.Apellido.trim();
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  if (nombre || apellido || req.body.FechaNac || req.body.correo) {
    if (nombre) {
      
      Usuario.findOneAndUpdate({ user: decode.usuario }, { names: req.body.Nombre }, function (err, place) {       
      });
    }
    if (apellido) {
      Usuario.findOneAndUpdate({ user: decode.usuario }, { lastnames: req.body.Apellido }, function (err, place) {
       
      });
    }
    if (req.body.FechaNac) {
      Usuario.findOneAndUpdate({ user: decode.usuario }, { birthdate: new Date(req.body.FechaNac) }, function (err, place) {
        
      });
    }
    if (req.body.correo) {
      var regexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      if (regexp.test(req.body.correo)) {
        Usuario.findOneAndUpdate({ user: decode.usuario }, { email: req.body.correo }, function (err, place) {
         
         return  res.status(200).render('ConfigInfoUsuario', { title: 'Configuracion Informacion del  usuario', Nombre : req.body.Nombre, Apellido: req.body.Apellido, correo : req.body.correo, FechaNac: req.body.FechaNac});
     

        });
      } else {
         res.render('ConfigInfoUsuario', { title: 'Configuracion Informacion del  usuario', err: "Su 'correo' no tiene formato de correo electronico" });
      }
    }
    
    res.render('ConfigInfoUsuario', { title: 'Configuracion Informacion del  usuario', acept: "Se ha actualizado sus datos correctamente" });
  } else {
    res.render('ConfigInfoUsuario', { title: 'Configuracion Informacion del  usuario', acept: "Se ha actualizado sus datos correctamente" });
  }
});

module.exports = router;