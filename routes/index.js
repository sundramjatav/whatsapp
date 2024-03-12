var express = require('express');
var router = express.Router();
const passport = require("passport")
var localStrategy = require('passport-local')

var db = require("../db")
var users = require('../model/user')
var {userMulter} = require("../multer/multer")

passport.use(new localStrategy(users.authenticate()))
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login',);
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.get('/deshboard',isloggedIn, async function (req, res, next) {
  // console.log(req.user);
  var user = await users.findOne({username: req.session.passport.user})
  res.render('index',{user});
});


router.post('/register', userMulter.single("avatar"), (req, res, next) => {
  var newUser = {
    //user data here
    username: req.body.username,
    email:req.body.email,
    profileImage:req.file.filename,
    Phone_number:req.body.mobile
    //user data here
  };
  users
    .register(newUser, req.body.password)
    .then((result) => {
      passport.authenticate('local')(req, res, () => {
        //destination after user register
        res.redirect('/deshboard');
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/deshboard',
  failureRedirect: '/',
}),
  (req, res, next) => { }
);

function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/');
}

router.get('/logout', (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) res.send(err);
      else res.redirect('/');
    });
  else {
    res.redirect('/');
  }
});


module.exports = router;
