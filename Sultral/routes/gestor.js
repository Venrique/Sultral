var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Element = require('../models/element');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/:username/:loc', function(req, res, next) {
  console.log(req.params.loc);
  res.render('Gestor', { title: 'Sultral', varLoc: req.params.loc, username: req.params.username});
});

router.get('/:username', function(req, res, next) {
  console.log('Hola1');
  res.redirect('/Gestor/'+req.params.username+'/root');
  

});

router.post('/:username/:loc', function(req, res, next){
  console.log('Hola2');
  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);

  const carpeta = new Element({
    _id: new mongoose.Types.ObjectId(),
    nombre: req.body.fname.trim(),
    ext: null,
    contenedor: null,
    contenido: [],
    creador: mongoose.Types.ObjectId(decode.Id),
    compartido: []
  });

  carpeta.save().then(result => {
    console.log(result);
    return res.status(200).redirect('/Gestor/'+req.params.username+'/'+req.params.loc);
  }).catch(error => {
    console.log(error);
    return res.status(400);
  });

});

module.exports = router;
