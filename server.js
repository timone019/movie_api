const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });


const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

// importing body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: "Kim",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Joe",
        favoriteMovies: ["Transformers"]
    },

]

let movies = [
    {
    "Title": "Transformers",
    "Description":"Autobot and Decepticon",
    "Genre": {
    "Name":"Action",
    "Description":"Robots in Disguise",
    "Year":"2007"
},
  "Director": {
    "Name": "Michael Bay",
  },
  "ImageUrl":"https://en.wikipedia.org/wiki/Transformers_%28film%29#/media/File:Transformers07.jpg",
  "Featured": false
},
  {
    "Title":"Terminator 2: Judgment Day",
    "Description":"Cyborg from the Future",
    "Genre": {
    "Name":"Sci-Fi",
    "Description":"Return of the reprogrammed Cyborg",
    "Year":"1991"
  },
  "Director": {
    "Name": "James Cameron",
  },
  "ImageUrl":"https://en.wikipedia.org/whttps://en.wikipedia.org/wiki/Terminator_2:_Judgment_Day#/media/File:Terminator2poster.jpgiki/Transformers_%28film%29#/media/File:Transformers07.jpg",
  "Featured": false
},

];

// Create New User

app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('User must have a name');
    }
    
})

// UPDATE or Put User 

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );
    
    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    }   else {
            res.status(400).send('User not found');
        }
})

// Create or Post

// app.post('/users/:id/:movieTitle', (req, res) => {
//     const { id, movieTitle } = req.params;
   
//     let user = users.find( user => user.id == id );
    
//     if (user) {
//         user.favoriteMovies.push(movieTitle);
//         res.status(200).send(`${movieTitle} has been added to ${id}'s array`);;
//     }   else {
//             res.status(400).send('User not found');
//         }
// })

//Add a user
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
          Users
            .create({
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

// Get all users
app.get('/users', async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // Get a user by username
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
app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
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

// Add a movie to a user's list of favorites
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
  
// Delete movieTitle
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
   
    let user = users.find( user => user.id == id );
    
    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from ${id}'s array`);;
    }   else {
            res.status(400).send('User not found');
        }
})

// Delete a user by username
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
  

// Delete user

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
   
    let user = users.find( user => user.id == id );
    
    if (user) {
        users = users.filter( user => user.id != id); 
        // res.json(users) for testing with postman
        res.status(200).send(`user ${id} has been deleted`);
    }   else {
            res.status(400).send('User not found');
        }
})

// READ or Get
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// READ or Get Movie Title
app.get('/movies/:title', (req, res) => {
    // const title = req.params.title; alternate code for object destructuring
    const { title } = req.params; // common object destructuring code
    const movie = movies.find( movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('Movie not found');
    }

});

// READ or Get Movie Genre
app.get('/movies/genre/:genreName', (req, res) => {
    
    const { genreName } = req.params; 
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre');
    }

});

// READ or Get Movie Directors
app.get('/movies/directors/:directorName', (req, res) => {
    
    const { directorName } = req.params; 
    const director = movies.find( movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director');
    }

});


app.listen(8080, () => console.log("listening on 8080"))