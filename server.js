const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

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

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
   
    let user = users.find( user => user.id == id );
    
    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${id}'s array`);;
    }   else {
            res.status(400).send('User not found');
        }
})

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