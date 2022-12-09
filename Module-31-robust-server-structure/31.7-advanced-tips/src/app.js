const express = require("express");
const app = express();
const teams = require("./data/teams-data");
const arenas = require("./data/arena-data");
const teamsRouter = require("./teams/teams.router");
const arenasRouter = require("./arenas/arenas.router");
const playersRouter = require("./players/players.router");




app.use(express.json()) //this lets teh app be able to read the body json data from postman

app.use("/teams", teamsRouter);
app.use("/arenas", arenasRouter);
app.use("/players", playersRouter);





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
app.use((req, res, next) => {
  next({status: 404, message:`Not found: ${req.originalUrl}`});
});


// Error handler
app.use((error, req, res, next) => {
  console.error(error);
 
  //if error has not status property, thend default it to 500
  //if error has no message property, then default message to "something went wrong..."
  const { status=500,message="Something went wrong" } = error;
  // response.statusCode(error.status)
  res.status(status).send(message)
});

module.exports = app;