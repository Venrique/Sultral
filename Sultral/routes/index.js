var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sultral' });
});

router.get('/LogIn.pug', function(req, res, next) {
  res.render('LogIn', { title: 'Sultral - Iniciar Sesión' });
});

router.get('/Registrar.pug', function(req, res, next) {
  res.render('Registrar', { title: 'Sultral - Registrarse' });
});
module.exports = router;
