//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/secretsDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if (!err){
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, result){
        if(!err){
            if(result){
                if(result.password === password){
                    res.render("secrets");
                }else{
                    console.log("Oop! Wrong password.");
                }
            }else{
                console.log("No such user found. Kindly register if new.");
            }
        }
    });
});


app.listen(3000, function(){
    console.log("Successfully connected to port 3000");
});