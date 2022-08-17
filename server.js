if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const users = [];

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const methodOverride = require('method-override')
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => {
    return users.find((user) => user.email === email);
  },
  (id) => {
    return users.find((user) => user.id === id);
  }
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

app.post("/login",checkNotAuthenticated,passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register",checkNotAuthenticated, (req, res) => {
  res.render("register");
});

app.post("/register",checkNotAuthenticated, async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });

    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.delete("/logout",(req,res,next)=>{
  req.logOut(function(err){
    if(err){
      return next(err)
    }
    else{
      res.redirect('/login')
    }
  })
})

function checkAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    return res.redirect('/')
  }

  next()
}

app.listen(3000);
