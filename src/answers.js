import React, { useState, useEffect } from 'react';
import './Table.css';

function AnsTable() {
  const [data, setData] = useState([]); // State to hold questions and answers
  const [currentUser, setCurrentUser] = useState(null);
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

  // Fetch questions data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/questions'); // Adjust to your API endpoint
        const result = await response.json();
        // Filter out questions without answers
        const filledAnswers = result.filter((item) => item.answer && item.answer.trim() !== ''&& item.currentUserName === currentUser.name);
        setData(filledAnswers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Skill Holder</th>
            <th>Skill</th>
            <th>Question</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.profileName}</td>
              <td>{item.skillName}</td>
              <td>{item.questionContent}</td>
              <td>{item.answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AnsTable;
