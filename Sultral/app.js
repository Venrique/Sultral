var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var ConfigDetalleRouter = require('./routes/configDetalle');
var ConfigPrivacidadRouter = require('./routes/ConfigPrivacidad');
var ConfigInfoUsuario = require('./routes/ConfigInfoUsuario');
var ConfigContactoRouter = require('./routes/ConfigContacto');
var gestorRouter = require('./routes/gestor');
var AcercaDeRouter = require('./routes/AcercaDe');
var ContactanosRouter = require('./routes/Contactanos');
const checkToken = require('./middleware/check_token');


var app = express();

//CONEXION A BASE DE DATOS
mongoose.connect('mongodb://Master:'+ process.env.MONGO_ATLAS_PW +'@sultral-shard-00-00-pidjg.mongodb.net:27017,sultral-shard-00-01-pidjg.mongodb.net:27017,sultral-shard-00-02-pidjg.mongodb.net:27017/test?ssl=true&replicaSet=Sultral-shard-0&authSource=admin&retryWrites=true',{
  useNewUrlParser: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/Cerrar', indexRouter);
app.use('/Registrar', registerRouter);
app.use('/LogIn', loginRouter);
app.use('/users', usersRouter);
app.use('/Gestor',checkToken, gestorRouter);
app.use('/ConfigDetalle',checkToken,ConfigDetalleRouter);
app.use('/ConfigInfoUsuario',checkToken, ConfigInfoUsuario);
app.use('/ConfigPrivacidad',checkToken, ConfigPrivacidadRouter);
app.use('/ConfigContacto',checkToken, ConfigContactoRouter );
app.use('/AcercaDe',AcercaDeRouter);
app.use('/Contactanos',ContactanosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('Not-Found', { title: 'Sultral'});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
