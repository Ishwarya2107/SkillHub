import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './feed.css';

function Body() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [skill, setSkill] = useState('');
  
  
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [followedProfiles, setFollowedProfiles] = useState([]);

 
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
    const fetchFollowedProfiles = async () => {
      try {
        const response = await fetch(`/followed-profiles?currentUserName=${currentUser.name}`);
        const data = await response.json();
        setFollowedProfiles(data.followedProfiles);
      } catch (error) {
        console.error('Error fetching followed profiles:', error);
      }
    };

    fetchFollowedProfiles();
  }, [currentUser]);
  useEffect(() => {
    const fetchFollowedPosts = async () => {
      try {
        if (currentUser) {
          const response = await fetch(`/followed-posts?userName=${currentUser.name}`);
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching followed posts:', error);
      }
    };

    fetchFollowedPosts();
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/users'); 
        const result = await response.json();
        const filteredUsers = result.filter(user => user.name !== currentUser?.name);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleUserClick = (name) => {
    navigate(`/user/${name}`); 
  };

  

  const handlePost = async () => {
    if (!postContent || !skill || !currentUser?.name) return;
  
    const postData = {
      name: currentUser.name,
      skill: skill,
      content: postContent,
    };
  
    try {
      const response = await fetch('/api/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        
        setPostContent('');
        setSkill('');
      } else {
        console.error('Failed to create post:', result);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  

  return (
    <div className="container">
      <div className="left-rectangle">
        <h3>Create a Post</h3>
        <div className="create-post-container">
          <input
            type="text"
            className="create-post-skill"
            placeholder="Enter skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <textarea
            className="create-post-textarea"
            placeholder="What do you want to talk about?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          

          <div className="create-post-actions">
            <button className="create-post-button" onClick={handlePost}>
              Post
            </button>
          </div>
        </div>
        
        <div>
          <h3>Latest Posts</h3>
        </div>

        <div className="post-list">
          {posts.map((post, index) => (
            <div key={index} className="post">
              <h4>{post.name} - {post.skill}</h4>
              <p>{post.content}</p>
             
            </div>
          ))}   
        </div>
      </div>

      <div className="right-rectangle">
      <h2>Following</h2>
      <ul>
        {followedProfiles.map((profileName) => (
          <li key={profileName} onClick={() => handleUserClick(profileName)}>
            {profileName}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default Body;
