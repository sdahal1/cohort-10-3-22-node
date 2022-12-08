//this is a tool that allows us to do more sophisticated routing
const router = require("express").Router();

//router needs to know which controller functions to forward requrest for specific routes to
const arenasController = require("./arenas.controller");

// already assumes routes have /teams

// /teams/
router.route("/").get(arenasController.list)
router.route("/:cityName").get(arenasController.read);

module.exports = router;