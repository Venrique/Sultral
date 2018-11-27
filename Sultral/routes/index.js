var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sultral' });
});

router.get('/Cerrar', function(req, res, next) {
  res.cookie('token','',{ expires: new Date()}).redirect('/');
});

module.exports = router;
