var express = require('express');
var router = express.Router();

const Users = require('../model/users');


/* GET users listing. */
router.get('/', function(req, res, next) {
  let userQuery = {};
  if (req.body) {
    if (req.body._id)
      userQuery._id = req.body._id;
    if (req.body.ign)
      userQuery.ign = req.body.ign;
    if (req.body.username)
      userQuery.username = req.body.username;
    if (req.body.created_date)
      userQuery.created_date = req.body.created_date;
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


router.get('/login/:username', function(req, res, next) {
  if (req.params.username) {
    Users.findOneWithPassword({username: req.params.username}, req.body.pwd)
      .then(data => {
        res.status(200).send({success: true, access_time: Date.now()});
      })
      .catch(err => {
        res.status(400).send({error: err.message});
      });
  } else
    res.status(401).send({error: "Unauthorized"});
});

router.get('/check/exists/:key', function(req, res, next) {
  if (req.body[req.params.key]) {
    Users.findOne({[req.params.key]: req.body[req.params.key]})
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
          res.status(200).send(data);
        } else {
          res.status(400).send({error: "Failed to create user"});
        }
      })
      .catch(err => {
        res.status(401).send({error: err.message});
      });
  } else 
    res.status(401).send({error: "Unauthorized"});
});


module.exports = router;
