import React, { useState,useEffect } from 'react';
import './Table.css';

function DataTable() {
  const [answers, setAnswers] = useState({}); // State to hold answers for each question
  const [data, setData] = useState([]); 
 
  const [currentUser, setCurrentUser] = useState(null);
  // State to hold answers for each question


// Handle input change to update the answer state
const handleInputChange = (id, value) => {
  setAnswers(prevAnswers => ({ ...prevAnswers, [id]: value }));
};

// Send answer to the backend
const handleSend = async (id) => {
  const answer = answers[id] || '';
  try {
    const response = await fetch(`/api/questions/${id}/answer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    });
    if (response.ok) {
      setData((prevData) => prevData.filter((item) => item._id !== id));
    } else {
      alert('Failed to submit answer');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

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
    const fetchQuestions = async () => {
      if (currentUser.name) { // Only fetch if currentUserName is available
        try {
          const response = await fetch(`/get-questions?profileName=${currentUser.name}`); // API endpoint to get questions for the current user
          const result = await response.json();
          
          setData(result); // Set the fetched data to state
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      }
    };

    fetchQuestions();
  }, [currentUser]); 
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Skill</th>
            <th>Question</th>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}> {/* Assuming _id is the unique identifier for questions */}
              <td>{item.currentUserName}</td> {/* Displaying the user's name */}
              <td>{item.skillName}</td> {/* Displaying the skill */}
              <td>{item.questionContent}</td> {/* Displaying the question content */}
              <td>
                <input
                  type="text"
                  value={answers[item._id] || ''} // Controlled input
                  onChange={(e) => handleInputChange(item._id, e.target.value)} // Update answer state
                  placeholder="Type your answer"
                />
                <button onClick={() => handleSend(item._id)}>Send</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
