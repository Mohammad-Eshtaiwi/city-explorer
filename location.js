export default function Location(city, data) {
  let { display_name: formatted_query, lat: latitude, lon: longitude } = data;
  this.city = city;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}
