const superagent = require("superagent");
function weatherHandler(req, res) {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${req.query.latitude}&lon=${req.query.longitude}&key=${process.env.WEATHER_API_KEY}`;

    superagent
        .get(url)
        .then(({ body }) => {
            let result = body.data.map((one) => {
                return new Weather(one);
            });
            res.send(result);
        })
        .catch((Error) => {
            console.log(Error.message);
        });
}

function Weather(data) {
    let { weather, datetime: time } = data;
    this.forecast = weather.description;
    this.time = time;
}

exports.weatherHandler = weatherHandler;
