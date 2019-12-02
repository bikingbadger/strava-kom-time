console.log("Client Side JS");

const url = `/weather`;
const weatherForm = document.querySelector("form");
const searchTerm = document.querySelector("input");
const forecastParagraph = document.querySelector("#forecast");
const locationParagraph = document.querySelector("#location");
const locationAPI = "https://ipapi.co/json/";
let map = null;
const defaultZoom = 12;

const updateWeather = location => {
  let weatherURL = null;
  if (location.address) {
    weatherURL = `${url}?address=${location.address}`;
  } else if (location.latlng) {
    weatherURL = `${url}?latitude=${location.latlng.lat}&longitude=${location.latlng.lng}`;
  } else {
    return;
  }

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
      setLocation(data);
    })
    .catch(error => {
      setWeather(data);
    });
};

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

  map.on("click", updateWeather);

  return map;
};

const setLocation = data => {
  map.setView(new L.LatLng(data.latitude, data.longitude), defaultZoom);
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
  if (data.error) {
    forecastParagraph.innerHTML = data.error;
    locationParagraph.innerHTML = null;
    return;
  }

  forecastParagraph.innerHTML = data.forecast;
  locationParagraph.innerHTML = data.location;
  searchTerm.value = "";
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

    updateWeather({ address: location });
  },
  false,
);

getLocation();
