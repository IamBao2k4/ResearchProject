const apiRouter = require("./api");

function route(app) {
    app.get("/", (req, res) => {
        res.send("Hello World");
    });

    app.use("/api", apiRouter);
}

module.exports = route;
