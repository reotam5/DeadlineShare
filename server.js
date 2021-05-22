const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const db = require('./config/keys').mongoURI;
mongoose.connect(db)
  .then(()=>{console.log("connected to MongoDB!!");})
  .catch((error)=>{ console.log(error)})

app.use('/api/assignment', require("./routes/api/assignment"));
app.use('/api/user', require("./routes/api/user"));
app.use('/api/group', require("./routes/api/group"));

const port = process.env.PORT || 5000;

app.listen(port, ()=>{console.log(`server started on port ${port}`)})