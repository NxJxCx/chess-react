var express = require('express');
var router = express.Router();

const Users = require('../model/users');


/* GET users listing. */
router.get('/', function(req, res, next) {
  let userQuery = {};
  if (req.query) {
    if (req.query._id)
      userQuery._id = req.query._id;
    if (req.query.ign)
      userQuery.ign = req.query.ign;
    if (req.query.username)
      userQuery.username = req.query.username;
    if (req.query.created_date)
      userQuery.created_date = req.query.created_date;
  }
  Users.findAllWithoutPassword(userQuery)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(400).send({error: err.message});
    });
});

router.get('/search/:key', function(req, res, next) {
  if (req.params.key && req.query.v) {
    switch (req.params.key) {
      case 'ign':
        Users.find({}).select({_id: 1, ign: 2, created_date: 3}).byIGN(req.query.v).exec()
          .then(data => {
            res.status(200).send(data);
          })
          .catch(err => {
            res.status(400).send({error: err.message});
          });
        break;
      case 'username':
        Users.find({}).select({_id: 1, ign: 2, created_date: 4}).byUsername(req.query.v).exec()
          .then(data => {
            res.status(200).send(data);
          })
          .catch(err => {
            res.status(400).send({error: err.message});
          });
        break;
      case '_id':
        Users.find({}).select({_id: 1, ign: 2, created_date: 3}).byID(req.query.v).exec()
          .then(data => {
            res.status(200).send(data);
          })
          .catch(err => {
            res.status(400).send({error: err.message});
          });
        break;
      default:
        res.status(400).send({error: 'Invalid Search'});
    } 
  } else {
    res.status(500).send({error: 'Unauthorized Access'});
  }
});

router.get('/check/exists/:key', function(req, res, next) {
  if (req.query.v) {
    Users.findOne({[req.params.key]: req.query.v})
      .then(data => {
        if (data)
          res.status(200).send({success: true});
        else
          res.status(200).send({success: false});
      })
      .catch(() => {
        res.status(400).send({error: 'Error Occured'});
      });
  } else
    res.status(401).send({error: "Unauthorized"});
});

/* POST */
router.post('/', function(req, res, next) {
  if (req.body) {
    Users.create(req.body)
      .then(data => {
        if (data) {
          res.status(201).send({success: data});
        } else {
          res.status(202).send({error: { message: "Failed to create user" } });
        }
      })
      .catch(err => {
        res.status(400).send({error: err.message});
      });
  } else 
    res.status(403).send({error: "Forbidden"});
});

// Login
router.post('/login', function(req, res, next) {
  if (req.body.username && req.body.pwd) {
    Users.findOneWithPassword({username: req.body.username}, req.body.pwd)
      .then(data => {
        if (data.success)
          res.status(200).send(data);
        else if (data.error)
          res.status(202).send(data);
      })
      .catch(err => {
        res.status(400).send({error: {  message: err.message }});
      });
  } else
    res.status(403).send({error: { message: "Forbidden" } });
});

module.exports = router;
