//this is a tool that allows us to do more sophisticated routing

const router = require("express").Router({ mergeParams: true });
const methodNotAllowed = require("../errors/methodNotAllowed");

//router needs to know which controller functions to forward requrest for specific routes to
const playersController = require("./players.controller");

// already assumes routes have /players

// /players/
router.route("/").get(playersController.list).all(methodNotAllowed)
router.route("/:playerId").get(playersController.read).all(methodNotAllowed)

module.exports = router;