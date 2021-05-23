const localStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = function(passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      (email, password, done) => {
        User.findOne({ email: email })
          .then((user) => {
            if (!user) return done(null, false, { message: "Email not registered." });
            bcrypt.compare(password, user.password, (error, isMatch)=>{
              if (error) return done(null, false, { message: "Something went wrong when verifying your credidential." })
              if (!isMatch) return done(null, false, { message: "Wrong password" });
              return done(null, user)
            });
          })
          .catch((error) => {
            return done(null, false, { message: "Something went wrong when retrieving user." });
          }
        );
      }
    )
  );

  passport.serializeUser((user, done)=>{
    done(null, user._id);
  });
  
  passport.deserializeUser((id, done)=>{
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
