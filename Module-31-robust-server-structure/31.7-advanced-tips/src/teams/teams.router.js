//this is a tool that allows us to do more sophisticated routing
const router = require("express").Router();
//router needs to know which controller functions to forward requrest for specific routes to
const teamsController = require("./teams.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//nested routing-> forward all routes /:teamId/players to the players router
const playersRouter = require("../players/players.router");
router.use("/:teamId/players", teamsController.findTeam, playersRouter);


//end nested routing


// already assumes routes have /teams

// /teams/
router.route("/").get(teamsController.list).post(teamsController.create).all(methodNotAllowed)
router.route("/:teamId").get(teamsController.read).put(teamsController.update).delete(teamsController.delete).all(methodNotAllowed);

module.exports = router;