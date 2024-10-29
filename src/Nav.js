
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCoins, faMessage, faBlog, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css'; 


function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const handleanswerclick = () => {
    navigate('/answers');
  }
  const handlequestionclick = () =>{
    navigate('/questions');
  }
  const handlehomeclick = () => {
    navigate('/about');
  }
  const handleblogclick = () =>{
    navigate('/blogs');
  }
  const handlescoreclick = () => {
    navigate('/score');
  }
  const handleProfileClick = () => {
    navigate('/edit'); 
    
  };
  const handleQuestionClick = () => {
    navigate('/questions')
  }
  

  return (
    
    <nav className="navbar">
      <div className="navbar-container">
      <div className="navbar-item" onClick={handlehomeclick}>
         
          <h1>SkillHub</h1>
        </div>
        <div className="search-bar">
      <input
        type="text"
        placeholder="Search a skill..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>

        <div className="navbar-item" onClick={handleanswerclick}>
          <FontAwesomeIcon icon={faMessage} size="2x" />
          <span>Answer</span>
        </div>
        <div className="navbar-item" onClick={handlequestionclick}>
          <FontAwesomeIcon icon={faMessage} size="2x" />
          <span>Question</span>
        </div>
        <div className="navbar-item" onClick={handleblogclick}>
          <FontAwesomeIcon icon={faBlog} size="2x" />
          <span>Blogs</span>
        </div>
        <div className="navbar-item" onClick={handleProfileClick}>
          <FontAwesomeIcon icon={faUser} size="2x" />
          <span>Profile</span>
        </div>

        <div className="navbar-item" onClick={handlescoreclick}>
          <FontAwesomeIcon icon={faCoins} size="2x" />
          <span>Score</span>
        </div>
        
      </div>
    </nav>
  );
}

export default Navbar;
