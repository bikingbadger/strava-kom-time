require("dotenv").config();
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const debug = require("debug")("weather-server");

const app = express();

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

  if (!req.query.address) {
    return res.send({
      error: "Must provide address",
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

        res.send({
          forecast: forecastData,
          location,
          address,
        });
      });
    });
  }  
});

app.get("*", (req, res) => {
  res.render("404", { title: "Weather App", author: "Hilton Meyer" });
});

app.listen(3000, () => {
  debug(`App started on 3000`);
});
