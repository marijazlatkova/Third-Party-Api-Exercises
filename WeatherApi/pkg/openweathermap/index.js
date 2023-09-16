const config = require("../config");

const CACHE = {};

const getCityWeather = async (city) => {
  let now = new Date().getTime() / 1000;

  if (CACHE[city] && now < CACHE[city].timestamp + config.getSection("weather").cache_expiery) {
    return CACHE[city];
  }

  const URL = `${config.getSection("weather").API_URL}/weather?q=${city}&units=metric&appid=${config.getSection("weather").api_key}`;

  try {
    const res = await fetch(URL);
    const data = await res.json();

    CACHE[city] = {
      timestamp: new Date().getTime() / 1000,
      data: data,
    };
  } catch (err) {
    throw err;
  }
};

const getFiveDaysForecastForCity = async (lat, lon) => {
  const URL = `${config.getSection("weather").API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${config.getSection("weather").api_key}`;

  try {
    const res = await fetch(URL);
    const data = await res.json();

   return data;
  } catch (err) {
    throw err;
  };
};

module.exports = {
  getCityWeather,
  getFiveDaysForecastForCity
};