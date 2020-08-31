"use strict";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
require("dotenv").config();
const superagent = require("superagent");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/location", (req, res) => {
    let city = req.query.city;
    const url = `https://eu1.locationiq.com/v1/search.php?key=${process.env.LOCATION_KEY}&q=${city}&format=json`;
    superagent.get(url).then(({ body }) => {
        let location = new Location(city, body);

        res.send(location);
    });
});

function Location(city, data) {
    let {
        display_name: formatted_query,
        lat: latitude,
        lon: longitude,
    } = data[0];

    this.city = city;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
}

// Weather

app.get("/weather", (req, res) => {
    let { data } = require("./data/weather.json");

    let result = data.map((one) => {
        return new Weather(one);
    });
    res.send(result);
});
function Weather(data) {
    let { weather, datetime: time } = data;
    this.forecast = weather.description;
    this.time = time;
}

// error
app.use(function (req, res, next) {
    // Do logging and user-friendly error message display.

    res.status(500).send("Sorry, something went wrong");
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
