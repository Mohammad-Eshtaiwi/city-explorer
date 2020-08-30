"use strict";

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Hello World!"));
// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
//   }
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

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
