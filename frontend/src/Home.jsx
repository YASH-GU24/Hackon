import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import Navbar from './components/Navbar';

const Home = () => {
  const [watchlist, setWatchlist] = useState([]);

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
          setWatchlist(watchlistData);
        })
        .catch((error) => {
          console.error('Error fetching user watchlist:', error);
        });
    }
  }, []);

  useEffect(() => {
    // Make another API call using the watchlist data
    if (watchlist.length > 0) {
      // You can access the watchlist here and make another API call if needed
      console.log('Watchlist data:', watchlist);
      // Make your additional API call here
      // Example:
      // axios.get('http://localhost:5000/another-api-endpoint', {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // })
      // .then((response) => {
      //   // Process the response from the additional API call
      // })
      // .catch((error) => {
      //   console.error('Error fetching additional data:', error);
      // });
    }
  }, [watchlist]);

  return (
    <div>
      <Navbar/>
   
      <div>
        <h2>Your Watchlist</h2>
        <ul>
          {watchlist.map((item) => (
            <li key={item.movieid}>{item.movieid}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
