// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import Home from './Home'
import ParentComponent from './ParentComponent';
import MoviePage from './MoviePage'; // Import the Movie component
import MovieDetailsPage from './MovieDetailsPage';
import Rent from './Rent';
import Timestamp2 from './Timestamp2';
import Timestamp from './Timestamp';
import PLotSearch from './PLotSearch';
import Login from './Login';
import Signup from './Signup';
function App() {


  return (
    <Router>
      <div className="App">
        {/* Render the Navbar only if not on the Login or Signup route */}
     
   
        <div className="content">
          <Routes>
            <Route path="/chat" element={<ParentComponent />} />
            <Route path='/login' element={<Login/>}/>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/home" element={<Home/>}/>
            <Route path='/signup' element={<Signup/>}/>
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
