const apiRouter = require("./api");
const siteRouter = require("./site");
const authRouter = require("./auth");
const profileRouter = require("./profile");
const checkinRouter = require("./checkin");
const checkoutRouter = require("./checkout");

function route(app) {
    app.use("/", siteRouter);

    app.use("/api", apiRouter);

    app.use("/auth", authRouter);

    app.use("/profile", profileRouter);

    app.use("/checkin", checkinRouter);

    app.use("/checkout", checkoutRouter);

    app.use((req, res) => {
        res.status(404).send("Not found");
    });
}

module.exports = route;
