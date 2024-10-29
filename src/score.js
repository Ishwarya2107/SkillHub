import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './score.css';

function Score() {
    const [currentUser, setCurrentUser] = useState(null);
    const [score, setScore] = useState(null);
    useEffect(() => {
        const fetchCurrentUser = async () => {
          try {
            const response = await fetch('/current-user'); 
            const result = await response.json();
            setCurrentUser(result);
          } catch (error) {
            console.error('Error fetching current user:', error);
          }
        };
    
        fetchCurrentUser();
      }, []);
      useEffect(() => {
        const fetchUserScore = async () => {
          try {
            const response = await fetch(`/user-score?name=${currentUser.name}`);
            if (!response.ok) {
              throw new Error('User not found');
            }
            const data = await response.json();
            setScore(data.score);
          } catch (err) {
            
          }
        };
    
        if (currentUser) {
          fetchUserScore();
        }
      }, [currentUser]);

      return (
        <div className="score-box">
       
          
              <h2 className="score-title">Score</h2>
              <h3 className="score-value">{score !== null ? score : 'Loading...'}</h3>
            
          
        </div>
      );
}

export default Score;