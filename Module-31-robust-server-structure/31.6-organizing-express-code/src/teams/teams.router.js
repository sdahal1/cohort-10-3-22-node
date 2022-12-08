//this is a tool that allows us to do more sophisticated routing
const router = require("express").Router();

//router needs to know which controller functions to forward requrest for specific routes to
const teamsController = require("./teams.controller");

// already assumes routes have /teams

// /teams/
router.route("/").get(teamsController.list).post(teamsController.create)
router.route("/:teamId").get(teamsController.read).put(teamsController.update).delete(teamsController.delete)

module.exports = router;