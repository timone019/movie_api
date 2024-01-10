import { useState, useEffect } from "react";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
// import { MovieView } from "../movie-view/movie-view";
// import { MovieCard } from "../movie-card/movie-card";


export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [user, setUser] = useState(storedUser?
        storedUser : null);
    const [token, setToken] = useState(storedToken?
        storedToken : null);
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    // const [register, setRegister] = useState(false);
    // const [login, setLogin] = useState(false);
   

    if (!user) {
        return (
            <>
            <LoginView 
            onLoggedIn={(user, token) => { 
                setUser(user); 
                setToken(token); 
                }} 
                />
                or
                <SignupView />
                </>
        );
}

useEffect(() => {
    if (!token) {
        return;
    }

    fetch("https://mymovies-8b73c95d0ae4.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.json())
    .then((movies) => {
        const moviesFromApi = movies.map((movie) => ({
            _id: movie._id,
            Title: movie.Title,
            Description: movie.Description,
            Genre: { 
                Name: movie.Genre.Name, 
                Description: movie.Genre,
            },
            Director: { 
                Name: movie.Director.Name, 
                Bio: movie.Director.Bio, 
                Birth: movie.Director.Birth,
            },
            // ImagePath: movie.ImagePath,
            Featured: movie.Featured
        }));

        setMovies(moviesFromApi);
    });
    }, [token]);

    if (selectedMovie) {
        return (
        <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
        );
    }

    if (movies.length === 0) {
        return <div>No movies found!</div>; 
    }

    return (
        <div>
            {movies.map((movie) => (
                <MovieCard 
                key={movie._id} 
                movie={movie} 
                onMovieClick={(newSelectedMovie) => {
                    setSelectedMovie(newSelectedMovie);
                }} 
                />
            ))}
            <button 
            onClick={() => {
                setUser(null);
                setToken(null);
            }}
            >
                Log out
                </button>
                </div>
    );
    };