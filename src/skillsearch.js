


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './skillsearch.css';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { skill, profiles } = location.state;
  
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/current-user');
        if (response.ok) {
          const result = await response.json();
          setCurrentUser(result);
        } else {
          console.error('Failed to fetch current user');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleProfileClick = (profile, skill) => {
    navigate('/skillprofile', { state: { profile, skill } });
  };

  return (
    <div className="search-results-container">
      <h2 className="search-heading">Search Results for "{skill}"</h2>
      <div className="profiles-grid">
        {profiles && profiles.length > 0 ? (
          profiles
            .filter(profile => profile.name !== currentUser?.name) // Exclude current user
            .map((profile, index) => (
              <div key={index} className="profile-card" onClick={() => handleProfileClick(profile, skill)}>
               <p className="profile-name">
  <span>{profile.name}</span>
  <p>Score: {profile.score}</p>
</p>
               
                <p className="profile-role">
                  {profile.currentJobRole}
                </p>
              </div>
            ))
        ) : (
          <p className="no-results">No profiles found with the skill "{skill}".</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;

