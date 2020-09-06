"use strict";
// dependencies

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
require("dotenv").config();
const superagent = require("superagent");
const pg = require("pg");

// routes handlers

const { locationHandler } = require("./routes/location");
const { weatherHandler } = require("./routes/weather");
const { trailsHandler } = require("./routes/trails");
const { moviesHandler } = require("./routes/movies");
const { yelpHandler } = require("./routes/yelp");
console.log(weatherHandler);

// setup express and its headers
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);

// home route
app.get("/", (req, res) => res.send("Hello World!"));

app.get("/location", (req, res) => {
    locationHandler(req, res, client);
});

// Weather

app.get("/weather", (req, res) => {
    weatherHandler(req, res);
});

// TRAIL

app.get("/trails", (req, res) => {
    trailsHandler(req, res);
});

//movies
app.get(`/movies`, (req, res) => {
    moviesHandler(req, res);
});

// yelp

app.get(`/yelp`, (req, res) => {
    yelpHandler(req, res);
});

// error
app.use(function (req, res) {
    // Do logging and user-friendly error message display.

    res.status(500).send("Sorry, something went wrong");
});

client.connect().then(() => {
    console.log(client);
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
});
