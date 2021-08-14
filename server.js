const user = require("./user_model");
const event = require("./event_model");
const express = require("express");
const knexfile = require("./knexfile")
const router = require("./router/route");

var app = express();
app.use(express.json());
app.use(router);

app.listen(3000,function(){
    console.log("running....");
});