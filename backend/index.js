const request = require('request');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios= require('axios');
const { PORT, CLIENT_ORIGIN, KEY, GEO_KEY, PLACES_KEY, DATABASE_URL} = require('./config');
const { dbConnect } = require('./db-mongoose');


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
const { router: authRouter, basicStrategy, jwtStrategy } = require('./auth');
const { router: usersRouter } = require('./users');
// const { router: restaurantRouter} = require('./restaurant');
passport.use(basicStrategy);
passport.use(jwtStrategy);
const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Request-Headers");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// endpoints
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);


// non db endpoints


app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
        skip: (req, res) => process.env.NODE_ENV === 'test'
    })
);

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// make this shoot the template for 404 to prevent 200 status code
app.get('/404',(req, res) => {
    res.status(404).send('not found');
})
// let server;


function runServer(url = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(url, { useMongoClient: true }, err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }

if (require.main === module) {
    dbConnect();
    runServer();
}
// for testing
function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }

module.exports = { app, runServer, closeServer };