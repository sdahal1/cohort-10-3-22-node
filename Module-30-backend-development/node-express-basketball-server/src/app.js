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
        city: "Atlanta"
    },
    {
        name: "Celtics",
        city: "Boston"
    },
    {
        name: "Falcons",
        city: "Atlanta"
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
    const {name} = req.query;

    let message = name? `Hello ${name}, welcome to the basketball server!` : "Hello User, welcome to the basketball server!"
    // res.json({message: "Bank balance is: 10000"})
    res.send(message);
}


const getAllTeams = (req,res,next)=>{
    // console.log(req.query)
    const {city} = req.query;

    //if query param for city is given, then only give back teams from that city
    if(city !== undefined){
        let filteredResult = teams.filter((team)=>team.city === city);
        if(filteredResult.length === 0){
            //if you call next() with content inside the (), then the next() will trigger the error handler function
            next("Team from this city is not available...try another city");
            // next();
        }
        res.json({data: filteredResult})
    }else{
        //otherwise give all the teams
        res.json({data: teams})
    }
}

//app.use just tells express app which functions to use in what order. You will want the function that returns a response to the client to be the latter of the two
app.use(morgan("dev"));
app.use(middlewareCheckAccountCredentials);





/* Routes */
app.get("/", sayHello)

app.get("/teams",getAllTeams)

app.get("/teams/:id",(req,res,next)=>{
    const {id} = req.params;
    if(id >= teams.length){
        next(`Team with the id of: ${id} does not exist. `)
    }
    res.json({data: teams[id]})
})

app.get("/say/goodbye", (req, res, next) => {
    
    const name = req.query.name; //get name from req.query ( ?variable)

    const content = name ? `Peace out, ${name}!` : `Peace be with you fam.`;
    res.send(content);
})

app.get("/say/:greeting", (req, res, next) => {
    const greeting = req.params.greeting; //get greeting from req.params (:variable)
    const name = req.query.name; //get name from req.query ( ?variable)

    const content = greeting && name ? `${greeting}, ${name}!` : `${greeting}!`;
    res.send(content);
})


// Not-found handler- have this AFTER all of your routes
app.use((req, res, next) => {
    //code to make morgan freeman audio play some friendly message would go here
    res.send(`The route ${req.path} does not exist!`);
});

// Error handler
app.use((err, req, res, next) => {
    console.log("error handler has been triggered!", err);
    res.send(err);
  });





// app.get("/teams",(req,res,next)=>{
//     res.json(teams)
// })

// app.get("/", (req,res,next)=>{
//     res.json({message: "Bank balance is: 10000"})
// })


module.exports = app; //export the express app for other files to have access to it