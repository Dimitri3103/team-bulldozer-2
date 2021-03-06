const createError = require('http-errors');
const express = require('express');
const { join } = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const redisUrl = require('redis-url');

const { json, urlencoded } = express;

const app = express();

// Sets up a session store with Redis
const sessionStore = new RedisStore({ client: redisUrl.connect(process.env.REDIS_URL) });

app.use(logger('dev'));
app.use(express.static(join(__dirname, 'public')));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  expressSession({
    store: sessionStore,
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: false,
  }),
);

// setup the passport middleware
require('./utils/passport')(app);

// load routes
require('./routes')(app);

// mongoose connection
require('./utils/mongoose');

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError.NotFound());
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
