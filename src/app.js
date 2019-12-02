require("dotenv").config();
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const debug = require("debug")("weather-server");

const app = express();
const port = process.env.PORT;

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// PAths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Static directory for serving images, css and js or
// anything else that might be static
app.use(express.static(publicDirectoryPath));

// Setup Handlebars Engine for Express
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.get("", (req, res) => {
  res.render("index", { title: "Weather App", author: "Hilton Meyer" });
});

app.get("/help", (req, res) => {
  res.render("help", { title: "Help", author: "Hilton Meyer" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About", author: "Hilton Meyer" });
});

app.get("/weather", (req, res) => {
  const address = req.query.address;
  console.log(req.query);
  if (!req.query.address && !req.query.longitude && !req.query.latitude) {
    return res.send({
      error: "Must provide address or co-ordinates",
    });
  }

  if (req.query.longitude && req.query.latitude) {
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      return res.send({
        forecast: forecastData,
        location: null,
        address,
        latitude,
        longitude,
      });
    });
  } else {
    geocode(address, (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        return res.send({
          forecast: forecastData,
          location,
          address,
          latitude,
          longitude,
        });
      });
    });
  }
});

app.get("*", (req, res) => {
  res.render("404", { title: "Weather App", author: "Hilton Meyer" });
});

app.listen(port, () => {
  debug(`App started on ${port}`);
});
