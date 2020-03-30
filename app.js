require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public/"));
app.set("view engine", 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

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
  .post((req, res) => {
      const username = req.body.username;
      const password = req.body.password;

      User.findOne({
          email: username
        }, (err, foundUser) => {
          if (err) console.log(err);
          else {
            if (foundUser) {
              bcrypt.compare(password, foundUser.password, (err, results) => {
                if (results === true) {
                  res.render("secrets");
                }
              });
            }
          }
      });
    });

    app.route("/register")
    .get((req, res) => {
      res.render("register");
    })
    .post((req, res) => {

      bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
          email: req.body.username,
          password: hash
        });
        newUser.save((err) => {
          if (err) console.log(err);
          else res.render("secrets");
        });
      });

    });
