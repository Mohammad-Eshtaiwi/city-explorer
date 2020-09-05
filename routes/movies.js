const superagent = require("superagent");

function moviesHandler(req, res) {
    let regionUrl = `https://api.themoviedb.org/3/configuration/countries?api_key=${process.env.MOVIE_API_KEY}`;

    superagent
        .get(regionUrl)
        .then(getRegions(req, res))
        .catch((Error) => {
            // console.log(Error);
        });
}
// get regions fron discover route
function getRegions(req, res) {
    return ({ text }) => {
        let englishNames = JSON.parse(text);
        // fliter the data to get the country object
        let targetedName = englishNames.filter((item) =>
            req.query.formatted_query.includes(item.english_name)
        );
        console.log(targetedName);
        // extract the region name from the object
        targetedName = targetedName[0].iso_3166_1;
        console.log(targetedName);
        let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&region=${targetedName}&sort_by=popularity.desc&page=1`;
        superagent.get(discoverUrl).then(getMovies(res));
    };
}

function getMovies(res) {
    return ({ body }) => {
        let movies = body.results.map((movie) => new Movie(movie));
        console.log(movies.length);
        res.send(movies);
    };
}

function Movie(movieData) {
    this.title = movieData.title;
    this.overview = movieData.overview;
    this.average_votes = movieData.vote_average;
    this.total_votes = movieData.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
    this.popularity = movieData.popularity;
    this.released_on = movieData.release_date;
}

exports.moviesHandler = moviesHandler;
