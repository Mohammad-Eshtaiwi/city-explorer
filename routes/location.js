const superagent = require("superagent");

function locationHandler(req, res, client) {
    // get data from the query
    let city = req.query.city;
    const url = `https://eu1.locationiq.com/v1/search.php?key=${process.env.LOCATION_KEY}&q=${city}&format=json`;
    // prepare sql query
    let safeValue = [city];
    let SQL = `select * from cities where city = $1`;
    // get data from data base
    client
        .query(SQL, safeValue)
        .then(({ rows }) => {
            if (rows.length > 0) {
                console.log("from rows");
                res.send(rows[0]);
            }
            // if the data base dont have the data then call it from the api and insert the data into the database
            else {
                getLocationFromApi(url, req.query.city, res, client);
            }
        })
        .catch((Error) => {
            console.log(Error.message);
        });
}

function getLocationFromApi(url, city, res, client) {
    // get the data from the api and insert it to the database then send it
    superagent.get(url).then(({ body }) => {
        "from super";
        let location = new Location(city, body);
        insertLocation(location, client);
        res.send(location);
    });
}

function Location(city, data) {
    let {
        display_name: formatted_query,
        lat: latitude,
        lon: longitude,
    } = data[0];
    console.log(data[0]);
    this.city = city;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
}
// simple insertion
function insertLocation(location, client) {
    let safeValues = [
        location.city,
        location.formatted_query,
        location.latitude,
        location.longitude,
    ];
    let SQL = `INSERT INTO cities (city,formatted_query,latitude,longitude) VALUES($1,$2,$3, $4);`;

    client
        .query(SQL, safeValues)
        .then((result) => {
            console.log("from super");
        })
        .catch((Error) => {
            console.log(Error.message);
        });
}

exports.locationHandler = locationHandler;
