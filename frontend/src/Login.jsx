import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const history = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signin', {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      
      history('/Home');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid credentials. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  }

  return (
    <div className='auth-form'>
      <form>
        <div className='form-inner'>
          <h2>Login</h2>
          <div className='form-group error'>
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email: </label>
            <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password: </label>
            <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
          </div>
          <button onClick={handleLogin} >Login</button>
          <div className='Signuplink'><Link to='/signup' style={{ textDecoration: 'none',color:"white" }}>Create a new Account</Link></div>
        </div>
      
      </form>

      
    </div>
  )
}

export default Login;
