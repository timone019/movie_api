/**
 * @file index.js is the root file for this API 
 * @see <a href="https://jsdoc.app/about-getting-started.html">JSDoc Guide</a>
 */

// Required modules
const express = require("express");
const uuid = require("uuid");

/**
 * Morgan middleware for logging HTTP requests.
 *
 * @type {morgan}
 */
const morgan = require("morgan");

/**
 * Express application instance.
 *
 * @type {express.Application}
 */
const app = express();

/**
 * Mongoose library for MongoDB object modeling.
 *
 * @type {Mongoose}
 */
const mongoose = require("mongoose");

/**
 * Models module.
 *
 * @type {Object}
 */
const Models = require("./models.js");

// Models
/**
 * Mongoose model for movies.
 *
 * @type {mongoose.Model}
 */
const Movies = Models.Movie;

/**
 * Mongoose model for users.
 *
 * @type {mongoose.Model}
 */
const Users = Models.User;

// MongoDB Connection via Mongoose
mongoose.connect(process.env.CONNECTION_URI);

// Log requests to server
app.use(morgan("common"));

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
/**
 * CORS middleware for handling cross-origin requests.
 *
 * @type {cors}
 */
const cors = require("cors");

/**
 * Allowed origins for CORS.
 *
 * @type {string[]}
 */
let allowedOrigins = [
  "https://loadedmovies.netlify.app",
  "http://localhost:1234",
  "https://groovymovieapp.netlify.app",
  "https://mustcmovies.netlify.app",
  "https://charming-crisp-c45fc4.netlify.app",
  "http://localhost:4200",
  "https://timone019.github.io",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application does not allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// Other routes and middleware...

/**
 * Port on which the server listens.
 *
 * @type {number|string}
 */
const port = process.env.PORT || 8080;

/**
 * Starts the server and listens on the specified port.
 */
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
