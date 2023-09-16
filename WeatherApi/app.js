//! Otvorete ja openweathermap i pronajdete soodvetno url koe sto ke vi ovozmozi da zemete prognoza za 5 denovi
//? Napravete nova funkcija spored dosegasnata i vratete prognoza za narednite 5 denovi
//* Ke vi treba i handler funkcija za da go povikate resursot t.e base funkcijata vo openweathermap

const express = require("express");

const config = require("./pkg/config");
const { getForCity, getFiveDaysForecast } = require("./handlers/weather");

const api = express();

api.get("/api/v1/weather/:city", getForCity);
api.get("/api/v1/forecast/:lat/:lon", getFiveDaysForecast);

api.listen(config.getSection("weather").PORT, (err) => {
  err
    ? console.log(err)
    : console.log(`Server started successfully on port ${config.getSection("weather").PORT}`);
});