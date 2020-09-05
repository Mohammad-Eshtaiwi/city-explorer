const superagent = require("superagent");
function trailsHandler(req, res) {
    const url = `https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&key=${process.env.TRAIL_API_KEY}`;
    superagent
        .get(url)
        .then(({ body }) => {
            let result = body.trails.map((item) => new Trails(item));
            res.send(result);
        })
        .catch((Error) => {
            console.log(Error);
        });
}

function Trails({
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
}) {
    let date = conditionDate.split(" ");
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

exports.trailsHandler = trailsHandler;
