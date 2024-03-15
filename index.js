const express = require("express");

uuid = require("uuid");

const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");

// Models
const Movies = Models.Movie;
const Users = Models.User;

// MongoDB Connection via Mongoose
mongoose.connect(process.env.CONNECTION_URI);

// log requests to server
app.use(morgan("common"));

// middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const cors = require("cors");

// CORS LimitedAccess
let allowedOrigins = ["https://loadedmovies.netlify.app", "http://localhost:1234", "https://groovymovieapp.netlify.app", "https://mustcmovies.netlify.app", "https://charming-crisp-c45fc4.netlify.app"];

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

const { check, validationResult } = require("express-validator");

// Import auth.js
let auth = require("./auth")(app);

// require passport authentication
const passport = require("passport");
require("./passport");

// auto-sends all files requested from the public folder
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to my movie app!");
});

// Create: Allow users to add a movie by movie ID to their list of favorites
app.post(
  "/users/:Username/movies/:MovieID", passport.authenticate("jwt", { session: false }),
  async (req, res) => { 
    // CONDITION TO CHECK PERMISSION
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    // PERMISSION CHECK ENDS
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//Create: Allow new users to register
/* We’ll expect JSON in this format
{
  ID: Integer,
  FullName: String,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post(
  "/users/register",
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check("Username", "Minimum 5 characters for Username").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }) //Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            FullName: req.body.FullName,
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Read: Return a list of ALL movies
app.get("/movies", passport.authenticate("jwt", { session: false }),
async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Read: Return data about a single movie by title
app.get("/movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Read: Return a list of ALL genres
app.get("/genres", (req, res) => {
  Movies.distinct("Genre.Name")
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Read: Return data about a genre by genre name
app.get("/genres/:genreName", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      res.status(201).json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Read: Get movie titles by Genre Name
app.get("/movies/genres/:genreName", (req, res) => {
  Movies.find({ "Genre.Name": req.params.genreName })
    .then((movies) => {
      if (movies.length === 0) {
        return res.status(400).send(req.params.genreName + " was not found");
      } else {
        res.status(200).json(movies.map((movie) => movie.Title));
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Read: Return a list of ALL directors
app.get("/directors", (req, res) => {
  Movies.distinct("Director.Name")
    .then((directors) => {
      res.status(200).json(directors);
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

// Read: Return data about a director (bio, birth year, death year) by name
app.get("/directors/:directorName", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      res.status(200).json(movie.Director);
    })
    .catch((err) => {
      res.status(500).send("Error: " + err);
    });
});

// Read: Return a list of ALL users - disabled for security reasons
// app.get(
//   "/users", 
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     try {
//       const users = await Users.find();
//       res.status(200).json(users);
//     } catch (err) {
//       res.status(500).send("Error: " + err);
//     }
//   }
// );

//co pilot suggestion for after =>
// app.get(
//   "/users",
//   async (req, res, next) => {
//     passport.authenticate("jwt", { session: false }, (err, user, info) => {
//       if (err) {
//         return next(err);
//       }
//       if (!user) {
//         return res.status(401).send(info.message);
//       }
//       req.user = user;
//       next();
//     })(req, res, next);
//   },
//   async (req, res) => {
//     try {
//       const users = await Users.find();
//       res.status(200).json(users);
//     } catch (err) {
//       res.status(500).send("Error: " + err);
//     }
//   }
// );

// .then .catch method
// app.get(
//   "/users",
//   passport.authenticate("jwt", { session: false }),
//   function (req, res) {
//     Users.find()
//       .then(function (users) {
//         res.status(200).json(users || []); // Send an empty array if 'users' is falsy
//       })
//       .catch(function (err) {
//         console.error(err);
//         res.status(500).send("Error: " + err);
//       });
//   }
// );

// Read: Return data about a single user by username



app.get(
  "/users/:Username", passport.authenticate("jwt", { session: false }),
  async (req, res) => {
       // CONDITION TO CHECK PERMISSION
       if (req.user.Username !== req.params.Username) {
        return res.status(400).send("Permission denied");
      }
      // PERMISSION CHECK ENDS
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// try catch method
// app.get(
//   "/users/:Username",
//   async (req, res) => {
//     try {
//       passport.authenticate("jwt", { session: false });
//       const user = await Users.findOne({ Username: req.params.Username });
//       user ? res.json(user) : res.status(404).send("User not found");
//     } catch (err) {
//       res.status(500).send("Error: " + err);
//     }
//   }
// );

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  FirstName: String,
  (required)
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/

// Update: Allow users to update only their user info via passport with token 
app.put(
  "/users/:Username", passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // CONDITION TO CHECK ADDED HERE
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    // CONDITION ENDS
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          FullName: req.body.FullName,
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Delete: Allow users to remove a movie from their list of favorites
app.delete(
  "/users/:Username/movies/:MovieID", passport.authenticate("jwt", { session: false }),
  (req, res) => { 
    // CONDITION TO CHECK PERMISSION
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    // PERMISSION CHECK ENDS

    // Update the user document by pulling the MovieID from the FavoriteMovies array
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then((updatedUser) => {
        // Check if the update was successful
        if (updatedUser) {
          res.json(updatedUser);
        } else {
          res.status(404).send("Delete didn't work");
        }
      })
      .catch((err) => {
        // Handle errors that might occur during the update
        res.status(500).send("Error: " + err);
      });
  }
);

// Delete: Allow existing users to deregister
app.delete(
  "/users/:Username", passport.authenticate("jwt", { session: false }),
  async (req, res) => { 
    await Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// access documentation.html using express.static
app.use("/documentation", express.static("public"));

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something busted!");
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
