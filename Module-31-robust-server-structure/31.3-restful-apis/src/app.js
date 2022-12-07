const express = require("express");
const app = express();
const teams = require("./data/teams-data")
const arenas = require("./data/arena-data")


app.use(express.json()) //this lets teh app be able to read the body json data from postman

// TODO: Follow instructions in the checkpoint to implement ths API.
app.get("/teams", (req,res,next)=>{
  res.json({data:teams})
})

app.get("/teams/:teamId", (req,res,next)=>{
  const {teamId} = req.params;
  //find the team in teams whose id is teamId
  let foundTeam = teams.find(team=>team.id===Number(teamId));
  if(foundTeam){
    res.json({data: foundTeam})
  }else{
    // next(`Team id not found: ${teamId}`)
    res.status(400).send(`Team Id: ${teamId} not found`);
  }
})

// //make a route to handle post requests to this url: /teams
app.post('/teams', (req,res,next)=>{
  //post data in the body of the post request from postman is represented by req.body
  const {data:{name, city, state, players}={}} = req.body;

  if(name){
    //generate a new unique id and make an object with the new team data from postman (req.body) with the new id embedded
    let newId = teams.length+1;
  
    //create an object to store into our teams data set-> this object will contain the body from the request ()
    let newTeam = {
      id:newId,
      name, 
      city, 
      state, 
      players
    }
  
    // console.log(newTeam);
    //add newly created objec to our dataset
    teams.push(newTeam);
    res.status(201).json({data: newTeam});
  }else{
    res.status(400).send("Missing the name")
  }
})




// TODO: return all arenas from /arenas in the form of { data: Array } -> it will say Array in platform IGNORE THAT, IT WILL BE AN OBJECT!!
app.get("/arenas", (req,res,next)=>{
  res.json({data: arenas})
})

// TODO: Return a single arena from /arenas/:cityName in the form of { data: { cityCode: String, arenaName: String } }
app.get("/arenas/:cityName", (req,res,next)=>{
  // const cityName = req.params.cityName;
  const {cityName} = req.params;

  let arenaName = arenas[cityName]
  if(arenaName === undefined){
    return next(`Arena from the given city ${cityName} not found!`)
  }
  res.json({data: {cityCode: cityName, arenaName} })
})






// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;