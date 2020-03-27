//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public/"));
app.set("view engine", ejs);

//---------------------Port Section---------------------
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server connected on " + PORT);
});

//---------------------Route Section---------------------
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});
