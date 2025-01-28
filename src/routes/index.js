const apiRouter = require("./api");
const siteRouter = require("./site");
const authRouter = require("./auth");

function route(app) {
    app.use("/", siteRouter);

    app.use("/api", apiRouter);

    app.use("/auth", authRouter);
}

module.exports = route;
