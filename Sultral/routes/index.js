var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.cookies.token != null){
    const decode = jwt.decode(req.cookies.token, process.env.JWT_KEY);
    console.log(decode);
    res.render('index', { title: 'Sultral', sesion: true, user: decode.usuario });
  }else{
    res.render('index', { title: 'Sultral' });
  }
});

router.get('/Cerrar', function(req, res, next) {
  res.cookie('token','',{ expires: new Date()}).redirect('/');
});

module.exports = router;
