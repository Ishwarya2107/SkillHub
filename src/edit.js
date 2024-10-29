import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './profile.css';


function EditForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [currentJobRole, setCurrentJobRole] = useState('');
    
    const [briefBio, setBriefBio] = useState('');
    
    
    const [message, setMessage] = useState(''); 
  
    const [skills, setSkills] = useState([{ skillName: '', skillLevel: '' }]);
    const addSkillFields = () => {
      const newSkills = skills.slice(); // Create a copy of the existing skills array
      newSkills.push({ skillName: '', skillLevel: '' }); // Add a new empty skill object
      setSkills(newSkills); // Update state with the new array
    };
    const handleInputChange = (index, event) => {
      const { name, value } = event.target;
      const newSkills = skills.slice(); // Copy the existing skills array
      newSkills[index][name] = value; // Update the specific field based on input
      setSkills(newSkills); // Update state with the new array
    };
    //auto add two fields
    
    
    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await fetch('/current-user-profile', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
    
            if (response.ok) {
              const userData = await response.json();
              // Pre-fill the form fields with the user's data
              setName(userData.name);
              setCurrentJobRole(userData.currentJobRole);
              
              setBriefBio(userData.briefBio);
              setSkills(userData.skills);
            } else {
              setMessage('Failed to fetch profile data');
            }
          } catch (error) {
            setMessage('Error fetching profile data');
          }
        };
    
        fetchProfile();
      }, []); 
    
  
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch('/edit-profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              currentJobRole,
              
              briefBio,
              skills
            }),
          });
    
          const result = await response.json();
          if (response.ok) {
            setMessage(result.message);
            navigate('/about'); 
          } else {
            setMessage(result.message || 'Failed to update profile');
          }
        } catch (error) {
          setMessage('Error updating profile');
        }
      };
    
     
    return (
        <div className="profile-container">
        <h2 className="h2-cp">Edit Profile</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
          <h5>Name</h5>
            <input
                className="profile-input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <h5>Current Job/Role</h5>
            <input
                className="profile-input"
                type="text"
                placeholder="Current Job/Role"
                value={currentJobRole}
                onChange={(e) => setCurrentJobRole(e.target.value)}
            />
          
            <h5>Brief Bio</h5>
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
            <input
            className="profile-input"
              type="text"
              name="skillAcquisition"
              value={skill.skillAcquisition}
              onChange={(event) => handleInputChange(index, event)}
              placeholder="Add skill Acquisition pathways"
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
      <button className="profile-button" type="submit">Save</button>
      </div>

           



        </form>
        <p className="profile-message">{message}</p>
    </div>
      );
    
  
   
  }
  
  export default EditForm;