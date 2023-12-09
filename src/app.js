const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rememberMiddleware = require('./middlewares/cookieAuthMiddleware');
const methodOverride = require('method-override');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');

// Rutas
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const noteRouter = require('./routes/notes');

// Configurando la carpeta publica
app.use(express.static('public'));

// Configurando EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configurando express para visualizar el req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurando method-override
app.use(methodOverride('_method'));

// Configurando CookieParser
app.use(cookieParser());

// Configurando Express-session
app.use(session({secret:'Secret path', resave: false, saveUninitialized: true}));

// Configurando rememberMiddleware
app.use(rememberMiddleware);

// Configurando Sistema de ruteo
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/note', noteRouter);

// Configurando notFoundMiddleware
app.use(notFoundMiddleware);

// Exportando modulo app, ya que el servidor se levanta en bin/www
module.exports = app;