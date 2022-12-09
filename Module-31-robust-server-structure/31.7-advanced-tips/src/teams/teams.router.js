//this is a tool that allows us to do more sophisticated routing
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");



//router needs to know which controller functions to forward requrest for specific routes to
const teamsController = require("./teams.controller");

// already assumes routes have /teams

// /teams/
router.route("/").get(teamsController.list).post(teamsController.create).all(methodNotAllowed)
router.route("/:teamId").get(teamsController.read).put(teamsController.update).delete(teamsController.delete).all(methodNotAllowed);

module.exports = router;