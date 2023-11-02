import React, { useState, useEffect } from 'react';
import RentCard from './RentCard';
import './Rent.css';

const Rent = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movie data from the API
    fetch('http://localhost:8000/rent-movies') // Update the URL accordingly
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className='rent-movies'>
      {movies.map((movie, index) => (
        <RentCard
          key={index}
          title={movie.title}
          price={movie.price}
          rating={movie.rating}
          imageUrl={movie.poster_link}
        />
      ))}
    </div>
  );
};

 export default Rent;
