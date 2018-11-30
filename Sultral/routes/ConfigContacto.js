var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Usuario = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/',function(req, res, next){
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

    var regex = new RegExp(req.body.Contacto);
    console.log(decode.usuario);
    Usuario.findOne({user: decode.usuario}, function(err, result) {
      if (err) throw err;
      console.log(result);
      console.log(result['contactos']);
      Usuario.find({user: {$ne:decode.usuario} ,_id: {$nin: result['contactos']}}, function(err, resultado){
        if(resultado.length != 0){
        console.log(resultado);
        res.render('ConfigContacto', { title: 'Agregar Contactos', FilasBD: JSON.stringify(resultado)});
        }else{
          res.render('ConfigContacto',{ title: 'Agregar Contactos', err: 'No hay usuarios para agregar'});
        }
      });
      

})
});

router.post('/', function (req, res, next) {

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

    var regex = new RegExp(req.body.Contacto);
    console.log(decode.usuario);
    Usuario.findOne({user: decode.usuario}, function(err, result) {
      if (err) throw err;
      console.log(result);
      console.log(result['contactos']);
      Usuario.find({$and: [ { user: { $ne: decode.usuario} }, { user:  regex } ],_id: {$nin: result['contactos']}}, function(err, resultado){
        if(resultado.length !=0){ 
        console.log(resultado);
        res.render('ConfigContacto', { title: 'Agregar Contactos', FilasBD: JSON.stringify(resultado)});
        }else{
          res.render('ConfigContacto',{title: 'Agregar Contactos', err: "Ya tiene a todos los usuarios agregados"})
        }
      });
      
        
    });
  /*
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  var regex = new RegExp(req.body.Contacto);
  Usuario.find({ user: regex })
  .exec().then((result) => {
    if(result){
    console.log(result);
    res.render('ConfigContacto', { title: 'Configuracion Usuario', FilasBD: JSON.stringify(result)});
    }
      
  });

*/

});

router.get('/:valor', function(req, res) {
  console.log(req.params.valor);
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  Usuario.findOne({user: req.params.valor}).exec().then(usuario =>{
    if(usuario){
      Usuario.findOneAndUpdate({user: decode.usuario},{$push: {contactos: mongoose.Types.ObjectId(usuario._id) }}, function(err, place){
        if(err){
          console.log(err);
        }else{
          console.log('Se agrego al usuario correctamente');
          res.redirect('/ConfigContacto')
        }
      });
    }else{
      console.log('No se encontro al usuario');
      res.redirect('/ConfigContacto')

    }
  }).catch(error => {
    console.log(error);
});

  

  
  
});

module.exports = router;