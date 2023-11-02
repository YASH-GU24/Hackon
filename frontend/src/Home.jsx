import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import Navbar from './components/Navbar';
import Movie from './Movie.js';
import { Link } from 'react-router-dom';

const Home = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState({});

  useEffect(() => {
    // Make an API call to get the user's watchlist
    const token = localStorage.getItem('token');
  
    if (token) {
      axios
        .get('http://localhost:5000/user-watchlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const watchlistData = response.data.watchlist;
          const sortedWatchlist = watchlistData.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
          // Set the watchlist state with movieid and movieTitle
          setWatchlist(sortedWatchlist);
        })
        .catch((error) => {
          console.error('Error fetching user watchlist:', error);
        });
    }
  }, []);
  

  useEffect(() => {
    // Make API calls for each movie in the watchlist
    const token = localStorage.getItem('token');

    if (token) {
      watchlist.forEach((item) => {
        axios
          .get(`http://localhost:8000/recommendations/${item.movieid}`, {})
          .then((response) => {
            setRecommendedMovies((prevRecommendedMovies) => ({
              ...prevRecommendedMovies,
              [item.movieid]: response.data.movies,
            }));
          })
          .catch((error) => {
            console.error(`Error fetching recommended movies for movie ${item.movieId}:`, error);
          });
      });
    }
  }, [watchlist]);

  return (
    <div>
      <Navbar />
      <div>

      {watchlist.map((item) => (
  <>
    <div className='watch-text'>{`Because you Watched ${item.movieTitle}`}</div>
    <div className='carousel-container'>
      {recommendedMovies[item.movieid] && (
        <div className="carousel">
          {recommendedMovies[item.movieid].map((movie, index) => (
            <div key={index} className="movie-carousel">
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                state={{
                  movieId: movie.id,
                }}
              >
                <Movie infos={movie} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
))}

        </div>
      </div>
  
  );
};

export default Home;
