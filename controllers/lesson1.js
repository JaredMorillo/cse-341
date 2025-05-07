const worldRoute = (req, res) => {
    res.send("This is the world route!");
    };

const homeRoute = (req, res) => {
    res.send("Welcome to the home page!");
    };

const helloRoute = (req, res) => {
    res.send("Hello World! This is a simple web server.");
    };

module.exports = {
    worldRoute,
    homeRoute,
    helloRoute
};