import React, { useState, useEffect } from 'react';
import './blog.css';

function Blogs() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/current-user');
        if (response.ok) {
          const result = await response.json();
          setCurrentUser(result);
          console.log('Current User:', result); // Debugging currentUser data
        } else {
          console.error('Failed to fetch current user');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const response = await fetch(`/api/blogs?userName=${currentUser.name}`);
        if (response.ok) {
          const blogs = await response.json();
          setUserBlogs(blogs);
          console.log('Fetched Blogs:', blogs); // Debugging blogs data
        } else {
          console.error('Failed to fetch user blogs');
        }
      } catch (error) {
        console.error('Error fetching user blogs:', error);
      }
    };

    if (currentUser?.name) {
      fetchUserBlogs();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <p>Loading...</p>; // Show loading if currentUser is not yet fetched
  }

  return (
    <div>
      <h2 style={{"margin-left": "50px"}}>{currentUser.name}'s Blogs</h2>
      <div className="postt-list">
        {userBlogs.length > 0 ? (
          userBlogs.map((blog) => (
            <div key={blog._id} className="post">
              <h4>{blog.skill}</h4>

              <p>{blog.content}</p>
            </div>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
}

export default Blogs;
