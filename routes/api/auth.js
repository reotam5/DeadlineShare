const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const passport = require("passport");
const protectRoute = require("../../middleware/protectRoute");

/*
@route  post api/auth/register/
@desc   Create a user. This does not login!!
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
      req.login(user, (err)=>{
        if (err) return res.json({error: err}); 
        res.json({
          user: {
            _id: req.user._id,
            email: req.user.email,
            name: req.user.name,
          },
        });
      });
    });
  });
});

/*
@route  POST api/auth/login
@desc   authenticate user
@access Private
*/
router.post("/login", passport.authenticate("local"), (req, res)=>{
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});


/*
@route  POST api/auth/logout
@desc   logout user
@access public
*/
router.post("/logout", (req, res) => {
  req.logout();
  res.json({ success: true });
});


/*
@route  DELETE api/auth/delete
@desc   Delete user
@access private
*/
router.delete("/delete", protectRoute, (req, res)=>{
  User.findByIdAndDelete(req.user._id)
    .then(()=>{ return res.json({ success: true }) })
    .catch(()=>{ return res.json({ success: false }) })
});



module.exports = router;
