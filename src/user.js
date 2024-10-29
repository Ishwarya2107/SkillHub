
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
  const { name } = useParams(); 
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/user/${name}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('User not found');
        }
        return response.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [name]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>User profile not found.</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-picture">
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-role">{profile.currentJobRole}</p>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-card">
          <h3>Brief Bio</h3>
          <p>{profile.briefBio}</p>
        </div>

        <div className="skills-section">
          <h3>Skills</h3>
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, index) => (
              <div key={index} className="detail-card">
                <p className="skill-name">{skill.skillName}</p>
                <hr className="skill-divider" />
                <p className="skill-acquisition"><strong>Skill Acquisition Pathways</strong><br />{skill.skillAcquisition}</p>
              </div>
            ))
          ) : (
            <p>No skills added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
