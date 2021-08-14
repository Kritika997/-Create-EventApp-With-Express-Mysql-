const express = require("express");
const user = require("../user_model")
const event = require("../event_model");
const route = new express.Router();

route.post("/signup",user.signup);
route.get("/login",user.login);
route.post("/eventcreate",event.eventcreate);
route.post("/updateEvent",event.updateEvent);
route.delete("/deleteEvent",event.deleteEvent);
route.get("/searchEvent",event.searchEvent);
route.get("/EventByOrder",event.EventByOrder);
route.get("/fetechAllUsers",event.fetechAllUsers);
route.get("/fetchAllEventsAndUsers",event.fetchAllEventsAndUsers);
route.get("/fetechAlleventsByUser",event.fetechAlleventsByUser);

module.exports = route; 



