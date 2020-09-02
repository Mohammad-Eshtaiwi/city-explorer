"use strict";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
require("dotenv").config();
const superagent = require("superagent");
const pg = require("pg");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);
app.get("/", (req, res) => res.send("Hello World!"));

app.get("/location", (req, res) => {
    let city = req.query.city;
    const url = `https://eu1.locationiq.com/v1/search.php?key=${process.env.LOCATION_KEY}&q=${city}&format=json`;
    let safeValue = [city];
    let SQL = `select * from cities where city = $1`;
    client.query(SQL, safeValue).then(({ rows }) => {
        console.log(rows);
        if (rows.length > 0) {
            console.log("from rows");
            res.send(rows);
        } else {
            getLocation(url, req.query.city, res);
        }
    });
});

function getLocation(url, city, res) {
    superagent.get(url).then(({ body }) => {
        "from super";
        let location = new Location(city, body);
        insertLocation(location);
        res.send(location);
    });
}

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
    // &lat=31.9515694&lon=-35.9239625
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${req.query.latitude}&lon=${req.query.longitude}&key=${process.env.WEATHER_API_KEY}`;

    superagent.get(url).then(({ body }) => {
        console.log(body);
        let result = body.data.map((one) => {
            return new Weather(one);
        });
        console.log(result);
        res.send(result);
    });
});

function Weather(data) {
    let { weather, datetime: time } = data;
    this.forecast = weather.description;
    this.time = time;
}
// TRAIL

app.get("/trails", (req, res) => {
    const url = `https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&key=${process.env.TRAIL_API_KEY}`;
    superagent
        .get(url)
        .then(({ body }) => {
            let result = body.trails.map((item) => new Trails(item));
            console.log(result);
            res.send(result);
        })
        .catch((Error) => {
            console.log(Error);
        });
});
function Trails(data) {
    let {
        name,
        location,
        length,
        stars,
        starVotes: star_votes,
        summary,
        url: trail_url,
        conditionStatus,
        conditionDetails,
        conditionDate,
    } = data;

    let date = conditionDate.split(" ");
    console.log(data.name);
    this.name = name;
    this.location = location;
    this.length = length;
    this.stars = stars;
    this.star_votes = star_votes;
    this.summary = summary;
    this.trail_url = trail_url;
    this.conditions = conditionStatus + ": " + conditionDetails;
    this.condition_date = date[0];
    this.condition_time = date[1];
}
// error
app.use(function (req, res, next) {
    // Do logging and user-friendly error message display.

    res.status(500).send("Sorry, something went wrong");
});

client.connect().then(() => {
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
});

function insertLocation(location) {
    let safeValues = [
        location.city,
        location.formatted_query,
        location.latitude,
        location.longitude,
    ];
    let SQL = `INSERT INTO cities (city,formatted_query,latitude,longitude) VALUES($1,$2,$3, $4);`;

    client.query(SQL, safeValues).then((result) => {
        console.log("from super");
    });

    // let SQL = `select * from cities`;

    // client.query(SQL).then((result) => {
    //     console.log(result);
    // });
}
