const superagent = require("superagent");

function yelpHandler(req, res) {
    let url = `https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${req.query.latitude}&longitude=${req.query.longitude}`;

    superagent
        .get(url)
        .set({ Authorization: "Bearer " + process.env.YELP_API_KEY })
        .accept("application/json")
        .then(({ text }) => {
            let { businesses } = JSON.parse(text);
            let result = businesses.map((item) => new Yelp(item));
            res.send(result);
        })
        .catch((Error) => {
            console.log(Error.message);
        });
}

function Yelp({ name, image_url, price, url }) {
    this.name = name;
    this.image_url = image_url;
    this.price = price;
    this.url = url;
}

exports.yelpHandler = yelpHandler;
