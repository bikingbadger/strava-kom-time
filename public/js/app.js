console.log("Client Side JS");

const url = `/weather?address=`;
const weatherForm = document.querySelector("form");
const searchTerm = document.querySelector("input");
const forecastParagraph = document.querySelector("#forecast");
const locationParagraph = document.querySelector("#location");
const locationAPI = "https://ipapi.co/json/";
let map = null;
const defaultZoom = 12;

const createMap = (elemId, centerLat, centerLng, zoom) => {
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
};

const setLocation = (data) => {
  console.log(`Set Location : ${data.latitude} ${data.longitude}`);
  map.setView(new L.LatLng(data.latitude,data.longitude), defaultZoom);
};

const getLocation = () => {
  fetch(locationAPI)
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
        map = createMap(
          "weathermap",
          location.latitude,
          location.longitude,
          defaultZoom,
        );
      } else {
        return Promise.reject("Could not get location via IP");
      }
    })
    .catch(error => {
      console.log(error);
    });
};

const setWeather = data => {
  console.log(`Set Weather: ${data}`);
  if (data.error) {
    forecastParagraph.innerHTML = data.error;
    locationParagraph.innerHTML = null;
    return;
  }
  forecastParagraph.innerHTML = data.forecast;
  locationParagraph.innerHTML = data.location;
};

weatherForm.addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const location = searchTerm.value;
    if (!location) {
      setWeather({ error: "No location given" });
      return;
    }

    const weatherURL = url + location;

    fetch(weatherURL)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.error);
        }
      })
      .then(data => {
        if (data.error) {
          setWeather(data);
          return;
        }
        setWeather(data);
        setLocation(data)
          
      })
      .catch(error => {
        setWeather(data);
      });
  },
  false,
);

getLocation();
