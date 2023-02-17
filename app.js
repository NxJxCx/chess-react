if (process.env.NODE_ENV !== "production") {
  require('dotenv').config({ path : "config.env"});
}
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var connectDB = require('./database/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

connectDB();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("react/build"));
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "react", "build", "index.html"));
  });
}

module.exports = app;
