const knex = require('knex');
const mysql = require("mysql");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const bodyParser = require("body-parser");
const connection = require("./knexfile");
const knexcon = knex(connection["development"]);

var app = express();
app.use(express.json())
app.use(bodyParser.json());
app.use(cookie());

exports.signup = (req,res)=>{
    const Myuser = {
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone_number,
        role:req.body.role
    };
    console.log(Myuser)
    knexcon("user_modle").insert([
        {name:Myuser.name,email:Myuser.email,phoneNumber:Myuser.phone,role:Myuser.role}
    ])
    .then((result)=>{
        var email = Myuser.email;
        var token = jwt.sign({email},"kritikaGaur",{
            expiresIn:"2h",
            
        })
        res.cookie("jwt",token).json({
            message:"userFounded",
            reg_token:token
        });
    }).catch((err)=>{
        res.status(201).send(err);
    });
};

exports.login = (req,res)=>{
    knexcon.select("email").from("user_modle")
    .where({email:req.body.email})
    .then((result)=>{
        if(result){
            var email = req.body.email;
            var token = jwt.sign({email},"kritikaGaur",{
            expiresIn:"2h"
        })
        res.cookie("jwt2",token).json({
            message:"founded",
            log_token:token
            
        })
        }else{
            res.send("failed");
        };
    })
    .catch((err)=>{
        res.send(err);
    });
};