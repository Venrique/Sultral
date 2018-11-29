var express = require('express');

var router = express.Router();
const jwt = require('jsonwebtoken');





router.get('/', function(req, res, next) {

    if(req.cookies.token != null){
      const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
      console.log(decode);
      res.render('AcercaDe', { title: 'Sultral - Acerca De', sesion: true, user: decode.usuario });
    }else{
      res.render('AcercaDe', { title: 'Sultral - Acerca De ' });
    }
  });


module.exports = router;