const routes = require("next-routes")();

routes.add("/games/:slug", "games");

module.exports = routes;
