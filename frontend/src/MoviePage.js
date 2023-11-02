import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import './moviePage.css';
import axios from 'axios';

const MoviePage = () => {
  const [playlistData, setPlaylistData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/playlists');
        const playlists = response.data;
        console.log(response.data);


        setPlaylistData(playlists);
      } catch (error) {
        console.error('Error fetching playlist data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="movie-page">
    
      {playlistData.map((playlist) => (
        <div key={playlist.id} className='playlist'>
          <h2>{playlist.name}</h2>
          <div className="movie-card-container">
            {playlist.movies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                state={{
                  movieId: movie.id,
              
                }}
              >
                <MovieCard
                  infos={movie}
                />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoviePage;
