var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
var five = require("johnny-five");
var board = new five.Board();
var distanciaAtual= 0;


board.on("ready", function() {
  var proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7
  });


  proximity.on("change", function() {
      distanciaAtual = this.cm;
  });
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.status(200).send({'distancia':distanciaAtual});

});


app.post('/', function (req, res) {
  var total = 0;
  var porcentagem = 0;
  var preenchido = 0;
  req.body.dimensions = JSON.parse(req.body.dimensions)
  console.log(req.body.dimensions)

  if(req.body.dimensions){
      total= req.body.dimensions.height * req.body.dimensions.width * req.body.dimensions.length

      var aux = distanciaAtual - req.body.dimensions.height;
      aux = aux * (-1)
      preenchido = aux * req.body.dimensions.width * req.body.dimensions.length;

      porcentagem = (preenchido * 100) / total;
      res.status(200).send({'porcentagem':porcentagem, 'distancia at' : distanciaAtual, 'preenchido' : preenchido, 'total' :total, 'aux':aux });

  }else{
    res.status(500).send('erro');

  }

});
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
app.listen(3000, '0.0.0.0');
