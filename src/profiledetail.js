import React, { useState , useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './profiledetail.css';

function ProfileDetail() {
  const location = useLocation();
  const [isDisabled, setIsDisabled] = useState(false);
  const { profile, skill } = location.state; 
  const [currentUser, setCurrentUser] = useState(null);
  const [questionContent, setQuestionContent] = useState('');

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




  if (!profile) {
    return <p>No profile data available.</p>;
  }

  
  const matchedSkill = profile.skills.find(skillObj => skillObj.skillName.toLowerCase() === skill.toLowerCase());
  ///////////
  const handleFollowSubmit = async () => {
    setIsDisabled(true); 
    const currentUserName = currentUser.name; // Replace this with actual current user name from your state/context
    const followData = {
      currentUserName,
      profileName: profile.name,
      skillName: skill,
    };
  
    try {
      const response = await fetch('/follow', { // Adjust the API endpoint as necessary
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(followData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to follow user');
      }
  
      const data = await response.json();
      console.log(data.message); // Handle success message
    } catch (error) {
      console.error('Error:', error);
    }
  };
  ///////////////
  

  const handleQuestionSubmit = async () => {
    setQuestionContent('');
    const currentUserName = currentUser.name; // Ensure currentUser is fetched correctly
    const questionData = {
        currentUserName,
        profileName: profile.name,
        skillName: skill,
        questionContent,
    };

    try {
        const response = await fetch('/submit-question', { // Adjust the API endpoint as necessary
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        });

        if (!response.ok) {
            throw new Error('Failed to submit question');
        }

        const data = await response.json();
        console.log(data.message); // Handle success message
        setQuestionContent(''); // Clear the question input after submission
    } catch (error) {
        console.error('Error:', error);
    }
};

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-picture">
       
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-role">{profile.currentJobRole}</p>
          <button className="send-question-button" onClick={handleFollowSubmit} disabled={isDisabled}>Follow</button>
        </div>
      </div>
      <div className="detail-card">
          <h3>Description</h3>
          <p>{profile.briefBio}</p>
        </div>
      <div className="profile-details">
        

        {matchedSkill ? (
          <>
           
            <div className="detail-card">
              <h3>Skill Acquisition Pathway</h3>
              <p>{matchedSkill.skillAcquisition}</p>
            </div>
          </>
        ) : (
          <p>No matching skill found for "{skill}".</p>
        )}

      </div>
      <div className="ask-question-container">
  <input
    className="ask-question-textarea"
    placeholder="Ask a question..."
    value={questionContent}
    onChange={(e) => setQuestionContent(e.target.value)}
  />
  <button className="send-question-button" onClick={handleQuestionSubmit}>
    Send
  </button>
</div>

    </div>
  );
}

export default ProfileDetail;


