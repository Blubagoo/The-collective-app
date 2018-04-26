require('dotenv').config();

module.exports = {
      JWT_SECRET: process.env.JWT_SECRET,
      PORT: process.env.PORT || 8080,
      CLIENT_ORIGIN: process.env.CLIENT_ORIGIN  || 'mongodb://localhost/mealmatcherdb',
      DATABASE_URL: process.env.DATABASE_URL  || 'mongodb://localhost/mealmatcherdb',
      TEST_DATABASE_URL: 
      process.env.TEST_DATABASE_URL ||
      'mongodb://localhost/mealmatcherdb',
      JWT_EXPIRY: process.env.JWT_EXPIRY,
      KEY: process.env.key,
      GEO_KEY: process.env.GEO_KEY,
      PLACES_KEY: process.env.PLACES_KEY
};