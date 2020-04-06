var express = require('express'),
router = express.Router(),
User = require("../models/user"),
passport = require('passport'),
middleware = require("../lib/middleware");

// Home page of User
router.get('/',middleware.isLoggedIn,(req,res) => {
  res.render("./notes/show",{title: "Notes"});
});

// Sign in methods
router.get('/login',(req,res)=>{
  res.render('./users/signForm',{title: "Log in"});
});

router.post("/login", passport.authenticate('local',
  {
    successRedirect: "/notes",
    failureRedirect: "/users/login",
    failureFlash: "Incorrect user or password"
  }), (req, res) => {
  }
);

// Sign up methods
router.get('/signup',(req,res)=>{
  res.render('./users/signForm',{title: "Sign up"});
});

router.post('/signup',(req,res)=>{
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    }
    else {
      req.flash("success", "Registered correctly");
      res.redirect("./login");
    }
  });
});

// Sign out method
router.post("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Session closed");
  res.redirect("/");
});

module.exports = router;