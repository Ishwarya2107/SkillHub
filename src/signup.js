import React, { useState } from 'react';
import './cp.css'; 
import { useNavigate } from 'react-router-dom';
function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, password }),
    });

    const result = await response.text();
    if (response.ok) {
      setMessage(result.message);
      navigate('/profile'); 
    } else {
      setMessage(result || "Login failed");
    }
  }
  

  return (
    <div className="signup-container">
      <h2 className="login-title">Signup</h2> 
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          className="signup-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="signup-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="signup-button" type="submit">Sign Up</button>
      </form>
      <p className="signup-message">{message}</p>
    </div>
  );
}

export default Signup;
