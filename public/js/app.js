console.log("Client Side JS");

const url = `/weather?address=`;
const weatherForm = document.querySelector("form");
const searchTerm = document.querySelector("input");
const forecastParagraph = document.querySelector("#forecast");
const locationParagraph = document.querySelector("#location");
const locationAPI = "https://ipapi.co/json/";
let map = null;

weatherForm.addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const location = searchTerm.value;
    if (!location) {
      locationParagraph.innerHTML = "No location given";
      return;
    }

    const locationURL = url + location;

    fetch(locationURL)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.error);
        }
      })
      .then(data => {
        if (data.error) {
          locationParagraph.innerHTML = data.error;
          return;
        }
        forecastParagraph.innerHTML = data.forecast;
        locationParagraph.innerHTML = data.location;
      })
      .catch(error => {
        locationParagraph.innerHTML = data.location;
      });
  },
  false,
);

function createMap(elemId, centerLat, centerLng, zoom) {
  var map = new L.Map(elemId);

  // Data provider
  var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  var osmAttrib =
    'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';

  // Layer
  var osmLayer = new L.TileLayer(osmUrl, {
    minZoom: 4,
    maxZoom: 20,
    attribution: osmAttrib,
  });

  // Map
  map.setView(new L.LatLng(centerLat, centerLng), zoom);
  map.addLayer(osmLayer);
  return map;
}

document.addEventListener("DOMContentLoaded", async function() {
  await fetch(locationAPI)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(data => {
      // Save location data to variable
      let location = data;
      if (location.latitude && location.longitude) {
        map = createMap("weathermap", location.latitude, location.longitude, 12);
      } else {
        return Promise.reject("Could not get location via IP");
      }
    })
    .catch(error => {
      console.log(error);
    });
  
});
