const players = require("../data/players-data")

function list(req,res,next){
    res.json({data:players})
}

function findPlayer(req,res,next){
  const {playerId} = req.params;
  //find the player in players whose id is playerId
  let foundPlayer = players.find(player=>player.id===Number(playerId));
  if(foundPlayer){
    const foundPlayerIndex = players.findIndex((player) => player.id === Number(playerId));
    //if a player was found, save it in memory so that the other middleware function dont have to query our database-> pass temporary saved data using res.locals
    res.locals.foundPlayer = foundPlayer;
    res.locals.foundPlayerIndex = foundPlayerIndex;
    return next()
    //return next() -> if you return next() then you dont need the else
  }
  next({status: 404, message: `Player Id: ${playerId} not found`});

}

function read(req,res,next){
    const {playerId} = req.params;
    const {foundPlayer} = res.locals;
    //find the team in players whose id is teamId
    // let foundPlayer = players.find(team=>team.id===Number(teamId));
    res.json({data: foundPlayer})
}


function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

function validateCity(req,res,next){
  //post data in the body of the post request from postman is represented by req.body
  const {data:{city}={}} = req.body;
  const validcities = ["New York City", "Boston", "Miami", "San Diego"];
 
  if(!validcities.includes(city)){
    return next({status: 400, message: "City not valid"});
  }
  next()
}

function create(req,res,next){
  //post data in the body of the post request from postman is represented by req.body
  const {data:{name, city, state}={}} = req.body;
  //generate a new unique id and make an object with the new team data from postman (req.body) with the new id embedded
  let newId = players.length+1;

  //create an object to store into our players data set-> this object will contain the body from the request ()
  let newTeam = {
    id:newId,
    name, 
    city, 
    state
  }

  // console.log(newTeam);
  //add newly created objec to our dataset
  players.push(newTeam);
  res.status(201).json({data: newTeam});
}


function update(req,res,next){
  //post data in the body of the post request from postman is represented by req.body
  const {data:{name, city, state}={}} = req.body;
  //get the teamId so we know which team to update
  const {teamId} = req.params;

  //find the team from our dataset whose id is equal to the teamId from the route
  // const foundTeam = players.find((team) => team.id === Number(teamId));
  const foundTeam = res.locals.foundTeam;
  // const foundTeamIndex = players.findIndex((team) => team.id === Number(teamId));


  //update the team dataset with the data from postman
  foundTeam.name = name;
  foundTeam.city = city;
  foundTeam.state = state;

  //update the dataset (array) at that foundteamindex-> nvm didnt need it
  // players[foundTeamIndex] = foundTeam

  res.status(201).json({data: foundTeam});
}


function destroy(req,res,next){
  const { teamId } = req.params;
  // const index = players.findIndex((team) => team.id === Number(teamId));
  // `splice()` returns an array of the deleted elements, even if it is one element
  const deletedplayers = players.splice(res.locals.foundTeamIndex, 1);
  res.sendStatus(204);
}


module.exports = {
    list,
    read: [findPlayer,read],
    // create:[
    //   bodyDataHas("name"),
    //   bodyDataHas("city"),
    //   bodyDataHas("state"),
    //   validateCity,
    //   create
    // ],
    // update: [
    //   findTeam,
    //   bodyDataHas("name"),
    //   bodyDataHas("city"),
    //   bodyDataHas("state"),
    //   validateCity,
    //   update
    // ],
    // delete: [findTeam,destroy]

}
