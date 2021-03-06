const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const protectRoute = require("../../middleware/protectRoute");

/*
@route  GET api/user/find/:id
@desc   Get user name
@access Private
*/
router.get("/find/:id", protectRoute, (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.json({
        user: {
          name: user.name
        }
      })
    })
    .catch((error) => {
      res.status(400).json({ success: false, msg: "Could not find user." });
    });
});

/*
@route  GET api/user/find
@desc   Get my info
@access Private
*/
router.get("/find", protectRoute, (req, res) => {
  res.json({
    user: req.user
  });
});

/*
@route  POST api/user/update
@desc   update my info
@access Private
{
 "name": "new name"
}
*/
router.post("/update", protectRoute, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id, 
    { 
      name: req.body.name,
    },
    { new: true, useFindAndModify: false }
  )
    .then((user) => {
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    })
    .catch((error) => {
      res.status(500).json({ success: false });
    });
});


/*
@route  GET api/user/verifyEmail/:email
@desc   checks if the email is already taken
@access Public
*/
router.get("/verifyEmail/:email", (req, res) => {
  const { email } = req.params;
  User.findOne({ email: email })
    .then(user=>{
      if(user) return res.json({ isValid: false });
      res.json({ isValid: true });
    })
    .catch(()=>{return res.status(500).json({ success: false, msg:"Error occured when retrieving user." })})
});

module.exports = router;
