const knex = require('knex');
const mysql = require("mysql");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const bodyParser = require("body-parser");
const connection = require("./knexfile");
const user_modle = require("./user_model")
const knexcon = knex(connection["development"]);


var app = express();
app.use(express.json())
app.use(bodyParser.json());
app.use(cookie());
"1"
exports.eventcreate = (req,res)=>{
    var created_token = req.headers.authorization;
    // console.log(created_token)
    if(created_token){
        const token = created_token.split(' ')[1];
        sliceToken = token.slice(5,token.length-1);
        // console.log(sliceToken)
        let decodeToken = jwt.decode(sliceToken,"kritikaGaur")
        req.decodeToken = decodeToken;
        console.log(decodeToken)
        knexcon.select("user_id").from("user_modle")
        .where({email:decodeToken.email})
        .then((result)=>{
            if(result.length!=0){
                knexcon("event_modle").insert([
                    { eventName: req.body.eventName, 
                        discription: req.body.discription, 
                        start_date: req.body.start_date, 
                        end_date:req.body.end_date,
                        city:req.body.city,
                        user_id:result[0]["user_id"]
                    }
                ])
                .then((data)=>{
                    if(data){ 
                        var eventName = req.body.eventName;
                        var id = result[0]["user_id"]
                        var token = jwt.sign({eventName,id},"kritika",{
                            expiresIn:"2h"
                    })
                    res.cookie("event",token).json({
                        message:"founded",
                        event_token:token
                    })
                    res.send(data);
                    }else{
                        res.send("failed")
                    }
                })
                .catch((err)=>{
                    res.send(err);
                })
            }else{
                res.send("sorry you can not create event! ")
            };
        })
        .catch((err)=>{
            res.send(err);
        });
    };

};
"2"
exports.updateEvent = (req,res)=>{
    var token = req.headers.authorization;
    if(token){
        let splitToken = token.split(' ')[1];
        let sliceToken = splitToken.slice(6, splitToken.length-1);
        // console.log(sliceToken)
        let decoded = jwt.decode(sliceToken,"kritika");
        // console.log(decoded)
        req.decoded=decoded
        knexcon.select("user_id").from("event_modle")
        .where({eventName:decoded.eventName},{city:decoded.city})        
        .then((result)=>{
            console.log(result);
            if(result.length!=0){
                console.log(result,"123456");
                knexcon.select("user_id").from("event_modle").where({user_id:decoded.id})
                .then((data)=>{
                    console.log(data[0]["user_id"])
                    console.log(result[0]["user_id"]); 
                    if(result[0]["user_id"]==data[0]["user_id"]){
                        console.log("bhuyt")
                        knexcon("event_modle").where({eventName:decoded.eventName},{city:decoded.city})
                        .update({
                            eventName:req.body.eventName,
                            discription:req.body.discription,
                            start_date:req.body.start_date,
                            end_date:req.body.end_date,
                            city:req.body.city
                        })
                        .then((reso)=>{
                            res.send("updated ");
                        }) 
                        .catch((err)=>{
                            res.send(err);
                        });
                    }else{
                        res.status(401).send("you cant not update it! ")
                    };
                })
                .catch((err)=>{
                    res.status(100).send(err);
                });
            }else{
                res.send("data not found! ")
            }
        });
    }else{
        res.status(404).send("token is not valid! ")
    };
};
"3"
exports.deleteEvent = (req,res)=>{
    var token = req.headers.authorization;
    if(token){
        let splitToken = token.split(' ')[1];
        let sliceToken = splitToken.slice(6,splitToken.length-1);
        // console.log(sliceToken)
        let decode = jwt.decode(sliceToken,"kritika");
        req.decode=decode
        // console.log(decode)
        var event = req.body.eventName
        var city = req.body.city
        console.log(event,city)
        knexcon.select("user_id").from("event_modle")
        .where({eventName:event,city:city})
        .then((result)=>{
            console.log(result)
            if(result.length!=0){
                console.log("ok")
                knexcon.select("user_id").from("event_modle")
                .where({user_id:decode.id})
                .then((data)=>{
                    console.log(data)
                   if(result[0]["user_id"]==data[0]["user_id"]){
                    //    console.log("done")
                        knexcon("event_modle").where({eventName:event,city:city})
                        .del()
                        .then((delData)=>{
                            res.status(200).send("deleted");
                        })
                        .catch((err)=>{
                            res.status(201).send(err); 
                        })
                   }else{
                       res.send("failed! ")
                   }
                })
                .catch((err)=>{
                    res.status(404).send(err);
                });
            }else{
                res.send("sorry you cant not delete the data from event! ")
            };
        })
        .catch((err)=>{
            res.status(400).send(err)
        });
    }else{
        res.send("token is not valit! ")
    };
};
exports.searchEvent = (req,res)=>{
    knexcon.select("*").from("event_modle").where({eventName:req.body.eventName},{city:req.body.city})
    .then((result)=>{
        if(result.length!=0){
            res.send(result);
        }else{
            res.send("not found")
        }
    })
    .catch((err)=>{
        res.send(err)
    })
}
"5"
exports.EventByOrder = (req,res)=>{
    knexcon.select("*").from("event_modle").orderBy('eventName', 'asc')
            .then((result) => {
                console.log("wertyj")
                if (result.length != 0) {
                    res.status(200).send(result)
                }
                else { 
                    res.send("no events")
                }
            }).catch((err) => {
                res.send(err)
            });
}
"6"
exports.fetechAllUsers = (req,res)=>{
    var token = req.headers.authorization;
    // console.log(token)
    if(token){
        let split = token.split(' ')[1];
        let slice = split.slice(5,split.length-1);
        // console.log(slice)
        let decode = jwt.decode(slice,"kritikaGaur");
        req.decode = decode
        console.log(decode)
        knexcon.select("role").from("user_modle")
        .where({email:decode.email})
        .then((result)=>{
            if(result.length!=0){
                console.log(user_role = result[0]["role"]);
                if(user_role=="Developer"){
                    knexcon.select("*").from("user_modle")
                    .where({role:"Developer"})
                    .then((data)=>{
                        res.status(200).send(data);
                    })
                    .catch((err)=>{
                        res.status(400).send(err);
                    });
                }else{
                    res.send("user not found! ");
                }
            }else{
                res.send("failed! ")
            };
        })
        .catch((err)=>{
            res.status(404).send(err);
        });
    }else{
        res.send("token is invalid! ");
    };
};

    
"7"
exports.fetchAllEventsAndUsers = (req,res)=>{
    var token = req.headers.authorization;
    if(token){
        split = token.split(' ')[1];
        slice = token.slice(12,split.length-1);
        // console.log(slice)
        decode = jwt.decode(slice,"kritikaGaur");
        // console.log(decode)
        req.decode=decode
        knexcon.select("*").from("user_modle").
        where({email:req.body.email})
        .then((result)=>{
            console.log(result)
            if(result.length!=0){ 
                console.log("ok")
                console.log(result[0]["role"])
                if(result[0]["role"]=="Developer"){
                    knexcon.select("user_modle.name","event_modle.eventName").from("user_modle")
                    .innerJoin("event_modle","user_modle.user_id", "=", "event_modle.user_id")
                    .then((result)=>{
                        res.send(result)
                    })
                    .catch((err)=>{
                        res.status(401).send(err);
                    })
                }else{
                    res.send("you are not right user")
                }
            }else{
                res.send("data not found")
            };
        })
        .catch((err)=>{
            res.status(404).send(err);
        })
    }else{
        res.send("token is not valid")
    };
};
 
// ?wertyuikl
exports.fetechAlleventsByUser = (req,res)=>{
    var token = req.headers.authorization;
    if(token){
        split = token.split(' ')[1];
        slice = token.slice(12,split.length-1);
        // console.log(slice)
        decode = jwt.decode(slice,"kritikaGaur");
        // console.log(decode)
        req.decode=decode
        knexcon.select("*").from("user_modle").
        where({email:req.body.email})
        .then((result)=>{
            console.log(result)
            if(result.length!=0){ 
                console.log("ok")
                console.log(result[0]["role"])
                if(result[0]["role"]=="Developer"){
                    knexcon.select("event_modle.eventName").from("user_modle")
                    .innerJoin("event_modle","user_modle.user_id", "=", "event_modle.user_id")
                    .then((result)=>{
                        res.send(result)
                    })
                    .catch((err)=>{
                        res.status(401).send(err);
                    })
                }else{
                    res.send("you are not right user")
                }
            }else{
                res.send("data not found")
            };
        })
        .catch((err)=>{
            res.status(404).send(err);
        })
    }else{
        res.send("token is not valid")
    };
};
