const express = require("express");
const app = express();
const route = express.Router();
const routes = require("./api/routes");

route.get("/", (req, res) => {
    res.send("Hello world");
});

app.use(express.json())

route.use("/api", routes);

app.use(route);

app.listen("3000", () => {
    console.log("http://localhost:3000");
});