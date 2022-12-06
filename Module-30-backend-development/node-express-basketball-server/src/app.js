/* Main purpose of app.js is to configure our express application (any routes, any middleware, security tools, ) */

const express = require("express"); //import express-> express lets us build a web api in a convienent way
const morgan = require("morgan"); //import morgan-> lets us see more details about requests to our server....and more!

const app = express(); //initialize an instance of an express application. app variable will contain all of the tools, functions, etc that express comes with

const teams = require("./data/teams-data");
const validateState = require("./utils/validateState");



/* ~~~~~~~~~~~~~~~~~~~~ MIDDLEWARE FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//responsive vs non-responsive middleware functions
    //responsive-> they send a response back to the client-> res.send(), res.json()
    //non-responsive-> they will trigger the next middleware in the pipeline or an error handler middleware
function middlewareexample1(req,res,next){

}

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


// const getAllTeams = (req,res,next)=>{
//     // console.log(req.query)
//     const {city} = req.query;

//     //if query param for city is given, then only give back teams from that city
//     if(city !== undefined){
//         let filteredResult = teams.filter((team)=>team.city === city);
//         if(filteredResult.length === 0){
//             //if you call next() with content inside the (), then the next() will trigger the error handler function
//             next("Team from this city is not available...try another city");
//             // next();
//         }
//         res.json({data: filteredResult})
//     }else{
//         //otherwise give all the teams
//         res.json({data: teams})
//     }
// }

function validateCityLength(req,res,next){
    const {cityName} = req.params;
    if(cityName.length < 2){
        return next("City name is too short. Try an actual city maybe?");
    }
    next();
}


/* ~~~~~~~~~~~~~~~~~~~~ END MIDDLEWARE FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/



/* ~~~~~~~~~~~~~~~~~~~~ BEGIN MIDDLEWARE PIPELINE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//app.use just tells express app which functions to use in what order. You will want the function that returns a response to the client to be the latter of the two
app.use(morgan("dev"));
app.use(middlewareCheckAccountCredentials);


/* Routes */
app.get("/", sayHello)

/* ~~~~~~~~~ 30.8 study guide ~~~~~~~~~~~~~~~~~~~~ */

app.get("/teams/all",(req,res,next)=>{
    //collect info from query parameters
    const {sort} = req.query;

    //respond with all the teams if no query parameter for "sort" is provided
    if(!sort){
        res.json({data: teams})
    } else if(sort === "ascending"){
        const teamsCopy = [...teams]
        //if ?sort=ascending is provided, then respond will all teams alphabetical order
        teamsCopy.sort((a,b)=>{
            return a.name > b.name ? 1 : -1
        })
        res.json({data: teamsCopy})
    } else if(sort === "descending"){
        const [...teamsCopy] = teams;
        //if ?sort=descending is provided, then respond will all teams reverse alphabetical order
        teamsCopy.sort((a,b)=>{
            return a.name > b.name ? -1 : 1
        })
        res.json({data: teamsCopy})
    } else{
        res.send("thats not an option for sort")
    }


    //if ?sort is provided, but its not ascending or descending, then send a message saying "thats not an option"

})

//check that a given state is present with a team in the dataset
app.get("/check/:stateName", validateState, (req,res,next)=>{
    const {stateName} = req.params;

    let doesTeamExist = teams.some(team=>{
        return team.state.toLowerCase() === stateName.toLowerCase();
    })
    if(doesTeamExist === true){
        res.send(`We have at least one team from ${stateName}`);
    }else{
        res.send(`We have at no teams from ${stateName}`);
    }
})


// for an example route:  /teams/california/players -> make sure the given state name is valid first, then it will get the teams from that state, and get all of the players from those teams and return an array of all the players from the given state name

app.get("/teams/:stateName/players", validateState, (req,res,next)=>{
    const {stateName} = req.params;
    let teamsFromGivenState = teams.filter(team=>team.state.toLowerCase() === stateName.toLowerCase())
    console.log("teams from given state", teamsFromGivenState)
    let allPlayersFromGivenState = []
    teamsFromGivenState.forEach(team=>{
        // allPlayersFromGivenState = allPlayersFromGivenState.concat(team.players)
        // allPlayersFromGivenState.push(team.players)
        allPlayersFromGivenState.push(...team.players)
        // 
    })

    res.json({data: allPlayersFromGivenState})
})




/* ~~~~~~~~~ 30.8 study guide END ~~~~~~~~~~~~~~~~~~~~ */


app.get(
    "/cities/:cityName", 
    validateCityLength, 
    (req,res,next)=>{
        //tells us if the cityName is a city in our data set
        const {cityName} = req.params;
        if(cityName.length < 2){
            return next("City name is too short. Try an actual city maybe?");
        }
        let doesCityExist = teams.some((team)=>team.city === cityName);
        if(doesCityExist){
            res.send("The city has a team!")
        }else{
            res.send("No teams found with that city name")
        }
})

app.get(
    "/teams/city/:cityName", 
    validateCityLength, 
    (req,res,next)=>{
        console.log("here")
        const {cityName} = req.params;
        if(cityName.length < 2){
            next("City name is too short. Try an actual city maybe?");
        }else{
            //show all teams from a given city
            let teamsFromCity = teams.filter(team=>team.city === cityName);
            res.json({data: teamsFromCity})
        }
})

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