console.log("Client Side JS");

const url = `http://localhost:3000/weather?address=`;
const weatherForm = document.querySelector("form");
const searchTerm = document.querySelector("input");
const forecastParagraph = document.querySelector("#forecast");
const locationParagraph = document.querySelector("#location");

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
