
// Morgan with logger to txt file
const express = require('express'),
  morgan = require('morgan')

//   fs = require('fs'), // import built in node modules fs and path 
//   path = require('path');

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory

const mongoose = require('mongoose');
const models = require('./models.js');

const Movies = Models.Movies;
const Users = Models.Users;
const Genres = Models.Genres;
const Directors = Models.Director;

Mongoose.connect('mongodb://127.0.0.1/cfDB', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true });

// importing body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json()); old code


// using morgan to log requests to the terminal
app.use(morgan('common'));

// let top10Movies = [
//     {
//       title: "Transformers",
//       year: 2007
//     },
    
//     {
//       title: "Terminator 2: Judgment Day",
//       year: 1991
//     },

// {   
//     title: "Black Panther: Wakanda Forever",
//     year: 2022
// },

//     {
//       title: "Antman",
//       year: 2015
//     },

//     {
//       title: "Antman and the Wasp",
//       year: 2018
//     },

//     {
//       title: "Iron Man",
//       year: 2008
//     },

//     {
//       title: "Spiderman No Way Home",
//       year: 2021
//     },

//     {
//       title: "Spider-Man: Into the Spiderverse",
//       year: 2018
//     },

//     {
//       title: "Spiderman: Across the Spiderverse",
//       year: 2023
//     },

//     {
//       title: "Gravity",
//       year: 2013
//     }
// ]

// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setting up express to serve static files
app.use(express.static('public')
);

app.get('/documentation.html', (req, res) => {   
  res.sendFile('public/documentation.html', {root: __dirname});
});

// setup the logger
// app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', (req, res) => {
  res.send('Welcome to my movie app!');  
});

// app.get('/movies', (req, res, next) => {
//     // Simulating an error (for demonstration purposes)
//     const err = new Error('This is a simulated error in /movies route');
//     next(err);
// });

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
  try {
    const users = await Users.find();
    // .then((users) => {
      res.status(201).json(users);
    }
    catch(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
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



// app.get('/movies', (req, res) => {
//   res.json(top10Movies);
// }); old code

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something busted!');
  });

  // listening for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});


// Morgan middleware
// const express = require('express'),
//   morgan = require('morgan');

// const app = express();

// app.use(morgan('common'));

// app.get('/', (req, res) => {
//   res.send('Welcome to my app!');
// });

// app.get('/secreturl', (req, res) => {
//   res.send('This is a secret url with super top-secret content.');
// });

// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });


// middleware with timestamp
// const express = require("express");
// const app = express(); 
// let myLogger = (req, res, next) => {
//   console.log(req.url);
//   next();
// };

// let requestTime = (req, res, next) => {
//   req.requestTime = Date.now();
//   next();
// };

// app.use(myLogger);
// app.use(requestTime);

// app.get('/', (req, res) => {
//   let responseText = 'Welcome to my app!';
//   responseText += '<small>Requested at: ' + req.requestTime + '</small>';
//   res.send(responseText);
// });

// app.get('/secreturl', (req, res) => {
//   let responseText = 'This is a secret url with super top-secret content.';
//   responseText += '<small>Requested at: ' + req.requestTime + '</small>';
//   res.send(responseText);

// });

// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });


// myLogger middleware
// let myLogger = (req, res, next) => {
//   console.log(req.url);
//   next();
// };

// app.use(myLogger);

// app.get('/', (req, res) => {
//   res.send('Welcome to my app!');
// });

// app.get('/secreturl', (req, res) => {
//   res.send('This is a secret url with super top-secret content.');
// });

// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });

// 2.2 Create a server
// http.createServer((request, response) => {
//   response.writeHead(200, {'Content-Type': 'text/plain'});
//   response.end('Welcome to my book club!\n');
// }).listen(8080);

// console.log('My first Node test server is running on Port 8080.');

// 2.2: Node.js Modules
// const http = require('http'),
//   url = require('url');

// http.createServer((request, response) => {
//   let requestURL = url.parse(request.url, true);
//   if ( requestURL.pathname == '/documentation.html') {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end('Documentation on the bookclub API.\n');
//   } else {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end('Welcome to my book club!\n');
//   }

// }).listen(8080);

// console.log('My first Node test server is running on Port 8080.');

// const path = require("path");

// routing express
// let topBooks = [
//   {
//     title: 'Harry Potter and the Sorcerer\'s Stone',
//     author: 'J.K. Rowling'
//   },
//   {
//     title: 'Lord of the Rings',
//     author: 'J.R.R. Tolkien'
//   },
//   {
//     title: 'Twilight',
//     author: 'Stephanie Meyer'
//   }
// ];

// // GET requests
// app.get('/', (req, res) => {
//   res.send('Welcome to my book club!');
// });

// app.get('/documentation', (req, res) => {                  
//   res.sendFile('public/documentation.html', { root: __dirname });
// });

// app.get('/books', (req, res) => {
//   res.json(topBooks);
// });


// // listen for requests
// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });