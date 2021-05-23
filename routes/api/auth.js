const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const passport = require("passport");

/*
@route  post api/auth/register/
@desc   Create a user. This does not login!! You have to login after you create an account
@access Public
{
  "email": "sample@gmail.com",
  "name": "sampleName",
  "password": "sample"
}
*/
router.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    //400 is bad request
    return res.status(400).json({ msg: "Please enter all fields." });
  }

  User.findOne({ email: email }).then((user) => {
    if (user)
      return res.status(400).json({ msg: "The email is already taken." });

    //I hash password on the ./models/User.js file.
    const newUser = new User({
      name: name,
      email: email,
      password: password,
    });

    newUser.save().then((user) => {
      res.json({
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    });
  });
});

/*
@route  POST api/auth/login
@desc   authenticate user
@access Public
*/
router.post(
  "/login", 
  (req, res, next) => {
    passport.authenticate(
      "local",
      (error, user, info)=>{
        if (error) throw error;
        //401 is unauthorized request
        if (!user) return res.status(401).json(info)

        res.json({
          user: {
            _id: user._id,
            email: user.email,
            name: user.name
          }
        });
      }
    )(req, res, next)
  },
);

module.exports = router;
