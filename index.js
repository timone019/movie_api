const express = require('express');
const bodyParser = require('body-parser'),
  uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

// Models
const Movies = Models.Movie;
const Users = Models.User;

// MongoDB Connection via Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/cfDB');

// mongoose.connect('mongodb://127.0.0.1:27017/cfDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

app.use(bodyParser.json());

// log requests to server
app.use(morgan('common'));

// middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// auto-sends all files requested from the public folder
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to my movie app!');
});

// Create: Allow users to add a movie to their list of favorites 
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Create: Allow new users to register
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Read: Return a list of ALL movies 
app.get('/movies', (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
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
        res.status(500).send('Error: ' + err);
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
        res.status(500).send('Error: ' + err);
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
        res.status(500).send('Error: ' + err);
    });
})

// Read: Return movie titles by Genre *still figuring this one out
// app.get('/movies/genre/:genreName', (req, res) => {
//   Movies.findMany({ "Genre.Name": req.params.genreName })
//     .then((movies) => {
//       res.status(200).json(movies);
//     })
//     .catch((err) => {
//       res.status(500).send('Error: ' + err);
//     })


// Read: Return a list of ALL directors
app.get('/directors', (req, res) => {
  Movies.distinct("Director.Name")
    .then((directors) => {
      res.status(200).json(directors);
    })
    .catch((err) => {
      res.status(500).send('Error: ' + err);
    });
    });

// Read: Return data about a director (bio, birth year, death year) by name
app.get('/directors/:directorName', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
      res.status(200).json(movie.Director);
    })
    .catch((err) => {
      res.status(500).send('Error: ' + err);
    });
  });

// Read: Return a list of ALL users
app.get("/users", function(req, res) {
  Users.find()
  .then(function (users) {
      res.status(200).json(users || []); // Send an empty array if 'users' is falsy
  })
  .catch(function (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

// Get all users with arrow functions
// app.get('/users', async (req, res) => {
//     await Users.find()
//       .then((users) => {
//         res.status(201).json(users);
//       })
//       .catch((err) => {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//       });
//   });

  // Read: Return data about a single user by username
app.get('/users/:Username', async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/

//Update: Allow users to update their info
app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      },
    },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
  
  });



// Delete: Allow users to remove a movie from their list of favorites
app.delete("/users/:id/:movieTitle", async (req, res) => {
  const { id, movieTitle } = req.params;

  const user = await Users.findById(id);

  if (user) {
    user.favMovies = user.favMovies.filter((title) => title !== movieTitle);
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("User not found");
  }
});


  // Delete: Allow existing users to deregister
app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// app.get('/documentation.html', (req, res) => {
//     res.sendFile('public/documentation.html', { root: __dirname });
//   });

// access documentation.html usig express.static
app.use("/documentation", express.static("public"));

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something busted!');
});

// Start server
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
