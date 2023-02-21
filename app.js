var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var usersRouter = require('./routes/users');

var app = express();

var connectDB = require('./database/database');

connectDB();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
}

app.use(function(request, response, next) {
  if (process.env.NODE_ENV === 'production' && !request.secure) {
    return response.redirect("https://" + request.headers.host + request.url);
  }
  next();
});

app.use('/api/users', usersRouter);

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
  app.use(express.static("react/build"));
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "react", "build", "index.html"));
  });
}

module.exports = app;
