"use strict";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/location", (req, res) => {
  let data = require("./data/location.json");
  let city = req.query.city;
  console.log(city);
  let location = new Location(city, data[0]);
  res.send(location);
});
function Location(city, data) {
  let { display_name: formatted_query, lat: latitude, lon: longitude } = data;

  this.city = city;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}

// Weather

app.get("/weather", (req, res) => {
  let { data } = require("./data/weather.json");
  let result = [];
  data.forEach((one) => {
    console.log(one);
    result.push(new Weather(one));
  });
  res.send(result);
});
function Weather(data) {
  let { weather, datetime: time } = data;
  this.forecast = weather.description;
  this.time = time;
}
app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
