
import { useNavigate } from 'react-router-dom'; 
import React from 'react';
import './home.css';
import resImage from './img.png';
function Home() {
    const navigate = useNavigate(); 

  const handleButtonClick = () => {
    navigate('/signup'); 
  };
  const handleLoginClick = () => {
    navigate('/login'); 
  };
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="logo">SkillHub</h1>
       
      </header>
      
      <main className="main-content" style={{"margin-left":"50px"}}>
        <div className="text-content">
          <h3 className='home-h2'>Connect and learn from the best skill holders to unlock your full potential and achieve your goals.</h3>
          <div className="home-buttons">
            <button className="home-button" onClick={handleButtonClick}>Register</button>
            <button className="home-button" onClick={handleLoginClick}>Login</button>
          </div>
        </div>
        
        <div className="image-content">
          <img src={resImage} alt="img" />
        </div>
      </main>
    </div>
  );
}

export default Home;