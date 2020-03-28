require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public/"));
app.set("view engine", 'ejs');

console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

//---------------------Port Section---------------------
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server connected on " + PORT);
});

//---------------------Route Section---------------------
app.get("/", (req, res) => {
  res.render("home");
});

app.route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser)=>{
      if(err) console.log(err);
      else {
        if(foundUser){
          if(foundUser.password === password) res.render("secrets");
        }
      }
    });
  });

app.route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save((err) => {
      if (err) console.log(err);
      else res.render("secrets");
    });
  });
