import React, { useState } from 'react';
import './profile.css'; 
import { useNavigate } from 'react-router-dom';

function ProfileForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [currentJobRole, setCurrentJobRole] = useState('');
  const [briefBio, setBriefBio] = useState('');
  const [message, setMessage] = useState('');
  const [skills, setSkills] = useState([]); 

  const handleInputChange = (index, event) => {
    const updatedSkills = skills.slice(); 
    updatedSkills[index] = Object.assign({}, updatedSkills[index], {
      [event.target.name]: event.target.value,
    });
    setSkills(updatedSkills); 
  };

  const addSkillFields = () => {
    const updatedSkills = skills.slice(); 
    updatedSkills.push({ skillName: '', skillAcquisition: '' });
    setSkills(updatedSkills);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        currentJobRole,
        briefBio,
        skills,  
      }),
    });
    const result = await response.json();
    if (response.ok) {
      setMessage(result.message);
      navigate('/login');  
    } else {
      setMessage(result || "Submission failed");
    }
  };

  

  return (
    <div className="profile-container">
      <h2 className="h2-cp">
        Create Profile
      </h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <input
          className="profile-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="profile-input"
          type="text"
          placeholder="Current Job/Role"
          value={currentJobRole}
          onChange={(e) => setCurrentJobRole(e.target.value)}
        />
        
        <textarea
          className="profile-input"
          placeholder="Brief Bio"
          value={briefBio}
          onChange={(e) => setBriefBio(e.target.value)}
        />
       
        
    
      
          {skills.map((skill, index) => (
        <div key={index} className="skill-fields">
          <div>
          <h5>Skill</h5>
            <input
            className="profile-input"
              type="text"
              name="skillName"
              value={skill.skillName}
              onChange={(event) => handleInputChange(index, event)}
              placeholder="Skill Name"
            />
          </div>
          <div>
          <h5>How Acquired</h5>
            <textarea 
            className="profile-input"
              type="text"
              name="skillAcquisition"
              value={skill.skillAcquisition}
              onChange={(event) => handleInputChange(index, event)}
              placeholder="Describe on how to acquire that skill"
            />
          </div>
        </div>
      ))}
  <div style = {{paddingBottom: '50px'}}>
  <button className="profile-button" type="button" onClick={addSkillFields}>
        Add Skill
      </button>

  </div>
      <div style = {{marginLeft: '600px'}}>
      <button className="profile-button" type="submit">Submit</button>
      </div>

     
      </form>
      <p className="profile-message">{message}</p>
    </div>
  );
}

export default ProfileForm;
