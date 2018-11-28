var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Element = require('../models/element');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/:username/:loc', function(req, res, next) {

  const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
  let locations = req.params.loc.split("-");
  let files;
  
  Element.find({"nombre" : locations[locations.length-1].toLowerCase(), "creador": mongoose.Types.ObjectId(decode.Id), "contenedor": null})
  .exec().then((result) =>{
    files = result;
    console.log(files);
  })

  res.render('Gestor', { title: 'Sultral', varLoc: req.params.loc.toLowerCase(), username: req.params.username});
});

router.get('/:username', function(req, res, next) {
  res.redirect('/Gestor/'+req.params.username+'/root');
});

router.post('/:username/:loc', function(req, res, next){
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
