var express = require('express');
var router = express.Router();
const Users = require('../model/users');

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  if (req.params.id) {
    const id = req.params.id;
    Users.findOne(id)
      .then(data => {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(400).send({error: "No match"})
        }
      })
      .catch(err => {
        res.status(400).send({error: "Error Occured"})
      });
  } else {
    res.status(401).send({error: "Unauthorized"});
  }
});

module.exports = router;
