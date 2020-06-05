const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  const url = 'https://api.ipify.org?format=json';
  request(url, (error, response, body) => {

    if (error) {
      callback(error, null);
    } else {
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
      } else {
        const data = JSON.parse(body);
        if (data.length === 0) {
          callback(null, "No results from website");
        } else {
          callback(null, data['ip']);
        }
      }
    }

  });
};

const fetchCoordsByIP = function(ip, callback) {
  const url = 'https://ipvigilante.com/' + ip;
  request(url, (error, response, body) => {

    if (error) {
      callback(error, null);
    } else {
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
        callback(Error(msg), null);
      } else {
        const { latitude, longitude } = JSON.parse(body)['data'];
        if ({ latitude, longitude }.length === 0) {
          callback(null, "No results from website");
        } else {
          callback(null, { latitude, longitude });
        }
      }
    }

  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {

    if (error) {
      callback(error, null);
    } else {
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching fly by times for coordinates. Response: ${body}`;
        callback(Error(msg), null);
      } else {
        const flyByTimes = JSON.parse(body).response;
        if (flyByTimes.length === 0) {
          callback(null, "No results from website");
        } else {
          callback(null, flyByTimes);
        }
      }
    }

  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };