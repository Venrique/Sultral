var express = require('express');

var router = express.Router();



router.get('/', function(req, res, next) {
    res.render('AcercaDe', { title: 'Sultral - Acerca de' });
});


module.exports = router;