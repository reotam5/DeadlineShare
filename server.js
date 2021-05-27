const express = require("express");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const config = require("config");
const passport = require("passport");
require("./config/passport")(passport);

app.use(express.json());

const db = config.get("mongoURI");
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to MongoDB!!");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(
  session({
    secret: config.get("sessionSecret"),
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/assignment", require("./routes/api/assignment"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/group", require("./routes/api/group"));
app.use("/api/auth", require("./routes/api/auth"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
