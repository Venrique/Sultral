var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('LogIn', { title: 'Sultral - Iniciar Sesión' });
});

module.exports = router;