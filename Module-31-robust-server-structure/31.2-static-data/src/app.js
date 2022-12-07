const express = require("express");
const app = express();
const teams = require("./data/teams-data")
const arenas = require("./data/arena-data")


app.use("/teams/:teamId", (req,res,next)=>{
  const {teamId} = req.params;
  //find the team in teams whose id is teamId
  let foundTeam = teams.find(team=>team.id===Number(teamId));
  if(foundTeam){
    res.json({data: foundTeam})
  }else{
    next(`Team id not found: ${teamId}`)
  }
})

// TODO: Follow instructions in the checkpoint to implement ths API.
app.use("/teams", (req,res,next)=>{
  res.json({data:teams})
})


// TODO: Return a single arena from /arenas/:cityName in the form of { data: { cityCode: String, arenaName: String } }
app.use("/arenas/:cityName", (req,res,next)=>{
  // const cityName = req.params.cityName;
  const {cityName} = req.params;

  let arenaName = arenas[cityName]
  if(arenaName === undefined){
    return next(`Arena from the given city ${cityName} not found!`)
  }
  res.json({data: {cityCode: cityName, arenaName} })
})


// TODO: return all arenas from /arenas in the form of { data: Array } -> it will say Array in platform IGNORE THAT, IT WILL BE AN OBJECT!!
app.use("/arenas", (req,res,next)=>{
  res.json({data: arenas})
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