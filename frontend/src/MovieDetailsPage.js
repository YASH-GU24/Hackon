import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from './MovieCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MovieDetailspage.css';
import StarsIcon from '@mui/icons-material/Stars';
import MovieIcon from '@mui/icons-material/Movie';
import ShopIcon from '@mui/icons-material/Shop';
import Navbar from './components/Navbar';

const MovieDetailsPage = () => {
  let { state } = useLocation();
  const movieId = state?.movieId;

  const [movieDetails, setMovieDetails] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isRecommendedContainerVisible, setRecommendedContainerVisible] = useState(false);

  // Ref to the recommended container
  const recommendedContainerRef = useRef(null);

  useEffect(() => {
    // Fetch movie details using Axios based on the movieId
    axios
      .get(`http://localhost:5000/movies/${movieId}`)
      .then((response) => {
        console.log(response.data)
        setMovieDetails(response.data)
      })
      .catch((error) => console.error('Error fetching movie details:', error));

    // Fetch recommended movies based on the movieId
    axios
      .get(`http://localhost:5000/recommendations/${movieId}`)
      .then((response) => {
        const recommendedMoviesData = response.data.movies;
        setRecommendedMovies(recommendedMoviesData);
      })
      .catch((error) => console.error('Error fetching recommended movies:', error));

    // Fetch playlists based on the movieId
    axios
      .get(`http://localhost:5000/playlist/${movieId}`)
      .then((response) => {
        const playlistsData = response.data.playlists;
        setPlaylists(playlistsData);
      })
      .catch((error) => console.error('Error fetching playlists:', error));

    // Add click event listener to the window to handle clicks outside of the container
    window.addEventListener('click', handleWindowClick);

    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener('click', handleWindowClick);
    };
  }, movieId);

  const handleWindowClick = (e) => {
    if (recommendedContainerRef.current && !recommendedContainerRef.current.contains(e.target)) {
      setRecommendedContainerVisible(false);
    }
  };

  const handleAddToWatchlist = async (movieid) => {
    try {
      const token = localStorage.getItem('token'); // Get the JWT token from localStorage
     
      if (!token) {
        // Handle not authenticated (redirect to login, show a message, etc.)
        return;
      }
  
      const response = await axios.post(
        'http://localhost:5000/add-movie-to-watchlist',
        { movieid }, 
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
  
      // Handle a successful response (e.g., show a success message)
      console.log(response.data);
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error(error);
    }
  };
  
  const actors = ["Shahrukh Khan" , "Alia Bhatt" , "Abhinav" , "Sushant Dhuria"];
  const genres = ['Action' , 'Horror' , 'Thriller' , 'Comedy' , 'Fiction'];

  return (
    <>
    <Navbar/>
  
    <div className="movie-details-page">
      {movieDetails && (
        <div className="movie-details__info">
          <div className="movie-details__desc">
            <h1 className="movie-details__title">{movieDetails.title}</h1>
            <div className='movie-details__rating'>
              IMDB Rating: 
              <StarsIcon style={{ color: '#FFC300'  , paddingLeft: '8px'}}/>
              <span>{movieDetails.rating}</span>
            </div>
            <p className="movie-details__director">Directed by:  {movieDetails.director}</p>
            {/* <div className='movie-details__genres'>
                  {movieDetails.genres?.map((genre) => {
                    return <span>{genre}</span>;
                  })}
            </div>
            <div className='movie-details__cast'>
                  Cast: {movieDetails.actors?.join(' , ')}
            </div> */}
            <p className="movie-details__description">{movieDetails.description}</p>
            <button className='movie-details-button watch-button' onClick={()=>handleAddToWatchlist(movieDetails.id)}>
              <MovieIcon style={{marginRight: '8px'}}/>
              Watch Now
            </button>
            {/* {movieDetails.rentPrice && (
              <button className="rent-button">
                Rent for ${movieDetails.rentPrice}
              </button>
            )} */}
              <button className="movie-details-button rent-button">
                <ShopIcon style={{marginRight: '8px'}}/>
                Rent for ${movieDetails.rentPrice}
              </button>
          </div>
          <div className="poster-image">
            <img src={movieDetails.poster_link} alt={movieDetails.title} />
          </div>
        </div>
)}

    <div className='cluster-section'>
      <h1>Recommended Movies:</h1>

      <div className="recommended-movie-overlay" onClick={() => setRecommendedContainerVisible(!isRecommendedContainerVisible)}>
        <div className="recommended-movie-collage" ref={recommendedContainerRef}>
          {recommendedMovies.slice(0, 4).map((movie) => (
            <img
              key={movie.id}
              src={movie.poster_link}
              alt={movie.title}
              className="recommended-movie-image"
            />
          ))}
        </div>
      </div>

      {isRecommendedContainerVisible && (
        <div className="recommended-movies-container">
          {recommendedMovies.map((movie) => (
            <div key={movie.id} className="movie">
              <Link to={`/movie/${movie.id}`} state={{ movieId: movie.id }}>
                <div className='movie-container'>
                <MovieCard infos={movie} />
                </div>
              </Link>
            </div>
          ))
        }
        </div>
)}

      <h1>Playlists:</h1>
      <div className="playlists-container">
        {playlists.map((playlist) => (
          <Playlist
            key={playlist.id}
            playlist={playlist}
          />
        ))
        }
      </div>
    </div>
  </div>
  </>
  );
};

export default MovieDetailsPage;

// Create a Playlist component for each playlist
function Playlist({ playlist }) {
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);

  const handlePlaylistClick = () => {
    setIsPlaylistVisible(!isPlaylistVisible);
  };

  return (
    <div className="playlist">
       <h3 className="overlay-text">{playlist.name}</h3>
      <div className="recommended-movie-overlay" onClick={handlePlaylistClick}>
        <div className="recommended-movie-collage">
          {playlist.movies.slice(0, 4).map((movie) => (
            <img
              key={movie.id}
              src={movie.poster_link}
              alt={movie.title}
              className="recommended-movie-image"
            />
         ) )}
        </div>
       
      </div>
      {isPlaylistVisible && (
        <div className="recommended-movies-container">
          {playlist.movies.map((playlistMovie) => (
            <div key={playlistMovie.id} className="playlist-movie">
              <Link to={`/movie/${playlistMovie.id}`} state={{ movieId: playlistMovie.id }}>
                <div className='movie-container'>
                <MovieCard infos={playlistMovie} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
