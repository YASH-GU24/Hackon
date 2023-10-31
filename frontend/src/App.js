// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import ParentComponent from './ParentComponent';
import MoviePage from './MoviePage'; // Import the Movie component
import MovieDetailsPage from './MovieDetailsPage';
import Rent from './Rent';
import Timestamp2 from './Timestamp2';
import Timestamp from './Timestamp';
import PLotSearch from './PLotSearch';
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<ParentComponent />} />
            <Route path="/movie" element={<MoviePage />} /> {/* Add the new Movie route */}
            <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
            <Route path="/rent" element={<Rent/>}/>
<Route path='/searchTimeStamp' element={<Timestamp/>}/>
<Route path='/searchTimeStamp/:videoid' element={<Timestamp2 />} />
<Route path='/plotsearch' element={<PLotSearch/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
