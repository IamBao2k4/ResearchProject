const apiRouter = require("./api");
const siteRouter = require("./site");
const authRouter = require("./auth");
const profileRouter = require("./profile");

function route(app) {
    app.use("/", siteRouter);

    app.use("/api", apiRouter);

    app.use("/auth", authRouter);

    app.use("/profile", profileRouter);
}

module.exports = route;
