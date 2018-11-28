var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');



/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('ConfigInfoUsuario', { title: 'Configuracion de informacion del usuario' });


});

router.post('/', function (req, res, next) {
  var nombre = req.body.Nombre.trim();
  var apellido = req.body.Apellido.trim();
  
  if (nombre) {
    Usuario.findOneAndUpdate({ user: "RicardoAlberto" }, { names: req.body.Nombre }, function (err, place) {
      res.send(place);
     
    });
  }
  else if (apellido) {
    Usuario.findOneAndUpdate({ user: "RicardoAlberto" }, { lastnames: req.body.Apellido }, function (err, place) {
      res.send(place);
      
    });
  }
  else if (req.body.FechaNac) {
    Usuario.findOneAndUpdate({ user: "RicardoAlberto" }, { birthdate: new Date(req.body.FechaNac) }, function (err, place) {
      res.send(place);
     
    });
  }
  else if (req.body.correo) {
    var regexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if(regexp.test(req.body.correo)){
    Usuario.findOneAndUpdate({ user: "RicardoAlberto" }, { email: req.body.correo }, function (err, place) {
      res.send(place);

    });
  }else{
      return res.render('ConfigInfoUsuario', { title: 'Configuracion Informacion del  usuario' , err: "Su 'correo' no tiene formato de correo electronico"});
  }
  }



});

module.exports = router;