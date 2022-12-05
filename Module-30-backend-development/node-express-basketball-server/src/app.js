/* Main purpose of app.js is to configure our express application (any routes, any middleware, security tools, ) */

const express = require("express"); //import express-> express lets us build a web api in a convienent way
const morgan = require("morgan"); //import morgan-> lets us see more details about requests to our server....and more!

const app = express(); //initialize an instance of an express application


/* bootleg database */
const teams = [
    {
        name: "Lakers",
        city: "Los Angeles"
    },
    {
        name: "Hawks",
        city: "Atlana"
    },
    {
        name: "Celtics",
        city: "Boston"
    }
]


/* Middleware functions */
const middlewareCheckAccountCredentials = (req,res,next)=>{
    //run some middle ware code (code to run before the final function gives a response to the client)

    //check to see if the user is logged in
    console.log("Verifying user credentials...")
    next() //go to the next middleware function or next response function
}




/* response function that will give the final response to the client */
const sayHello =  (req,res,next)=>{
    // res.json({message: "Bank balance is: 10000"})
    res.send("Hello User, welcome to the basketball server!");
}


const getAllTeams = (req,res,next)=>{
    res.json({data: teams})
}

//app.use just tells express app which functions to use in what order. You will want the function that returns a response to the client to be the latter of the two
app.use(morgan("dev"));
app.use(middlewareCheckAccountCredentials);
app.get("/", sayHello)
app.get("/teams",getAllTeams)

// app.get("/teams",(req,res,next)=>{
//     res.json(teams)
// })

// app.get("/", (req,res,next)=>{
//     res.json({message: "Bank balance is: 10000"})
// })


module.exports = app; //export the express app for other files to have access to it