const express = require("express");
const router = express.Router();

const User = require("../../models/User");

/*
@route  GET api/user/find/:email
@desc   Get a user
@access Public for now...
*/
router.get("/find", (req, res) => {
  //I should probably save hashed password to authenticate
  User.findOne({ email: req.params.email })
    .then((user) => res.json(user))
    .catch((error) => {
      res.status(403).json({ error: error });
    });
});

/*
@route  POST api/user/add
@desc   Create an user
@access Public
*/
router.post("/add", (req, res) => {
  const newUser = new User({
    email: req.body.email,
    name: req.body.name,
  });
  newUser
    .save()
    .then((user) => res.json(user))
    .catch((error) => {
      res.status(403).json({ error: error });
    });
});

/*
@route  POST api/user/update/:email
@desc   update an user
@access Public
*/
router.post("/update/:email", (req, res) => {
  User.findOneAndUpdate({ email: req.params.email }, { name: req.body.name }, { new: true })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      res.status(403).json({ error: error });
    });
});

/*
@route  POST api/user/delete/:email
@desc   Delete an user
@access Public for now...
*/
router.delete("/delete/:email", (req, res) => {
  User.findOne({ email: req.params.email })
    .then((user) => {
      user.remove().then(() => {
        res.json({ success: true });
      });
    })
    .catch(() => {
      res.status(403).json({ success: false });
    });
});

module.exports = router;
