const express = require('express');

const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');


const PORT = process.env.PORT || 5001;


const mongoURI = 'mongodb://localhost:27017/skillhub';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  
  .catch(err => console.error('MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  loggedIn: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
});
const User = mongoose.model('User', userSchema);

const questionSchema = new mongoose.Schema({
  currentUserName: { type: String, required: true },
  profileName: { type: String, required: true },
  skillName: { type: String, required: true },
  questionContent: { type: String, required: true },
  answer: { type: String, default: '' }
  
});

const Question = mongoose.model('Question', questionSchema);

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true  
  },
  currentJobRole: {
    type: String,
    required: true  
  },
  briefBio: {
    type: String,
    required: true  
  },
  
  skills: [
    {
      skillName: {
        type: String,
        required: true  
      },
      skillAcquisition: {
        type: String,
        required: true  
      }
    }
  ]
});
const Profile = mongoose.model('Profile', profileSchema);


const postSchema = new mongoose.Schema({
  name: String,
  skill: String,
  content: String,
  
  
});
const Post = mongoose.model('Post', postSchema);

const followSchema = new mongoose.Schema({
  currentUserName: { type: String, required: true },
  profileName: { type: String, required: true },
  skillName: { type: String, required: true },
});

const Follow = mongoose.model('Follow', followSchema);

const session = require('express-session');

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));




app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'build')));



app.post('/api/create-post', async (req, res) => {
  try {
   
    console.log(req.body)
    const { name, skill, content } = req.body; 
   

    const newPost = new Post({ name, skill, content});
    await newPost.save();
    await User.findOneAndUpdate({ name: name }, { $inc: { score: 1 } });
    res.json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating post' });
  }
});


app.get('/user-score', async (req, res) => {
  const { name } = req.query;

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ score: user.score });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/questions/:id/answer', async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  try {
    const question = await Question.findByIdAndUpdate(
      id,
      { answer },
      { new: true } // Return the updated document
    );

    if (question) {
      res.status(200).json({ message: 'Answer updated successfully', question });
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find({ answer: { $ne: '' } });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error });
  }
});
////////////////
app.post('/submit-question', async (req, res) => {
  const { currentUserName, profileName, skillName, questionContent } = req.body;

  try {
      const newQuestion = new Question({
          currentUserName,
          profileName,
          skillName,
          questionContent,
      });

      await newQuestion.save();
      res.status(201).json({ message: 'Question submitted successfully' });
  } catch (error) {
      console.error('Error saving question:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// Assuming you have required necessary packages and connected to MongoDB

app.get('/get-questions', async (req, res) => {
  const { profileName } = req.query; // Get current user name from query parameters
  console.log(profileName)
  try {
    // Fetch questions that match the current user's name and have an empty answer field
    const questions = await Question.find({ 
      profileName,
      answer: { $in: [null, ''] } // Checks for empty or null answer
    });
    
    res.json(questions); // Send the questions as JSON response
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




////////
app.get('/followed-posts', async (req, res) => {
  const currentUserName = req.query.userName; // Assume the username is passed as a query parameter

  try {
    // Step 1: Find the profiles and skills the user follows
    const follows = await Follow.find({ currentUserName });

    // If no follows are found, return an empty array immediately
    if (follows.length === 0) {
      return res.json([]); // Return an empty array if the user is not following anyone
    }

    // Step 2: Map to extract profile names and skill names
    const profileSkillPairs = follows.map(follow => ({
      name: follow.profileName,
      skill: follow.skillName,
    }));

    // Step 3: Find posts matching any of the profile and skill combinations
    const posts = await Post.find({ $or: profileSkillPairs });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching followed posts:', error);
    res.status(500).json({ message: 'Error retrieving followed posts' });
  }
});

app.get('/followed-profiles', async (req, res) => {
  const { currentUserName } = req.query; 

  try {
    const follows = await Follow.find({ currentUserName });
    const followedProfiles = follows.map((follow) => follow.profileName);

    res.json({ followedProfiles });
  } catch (error) {
    res.status(500).json({ message: "Error fetching followed profiles" });
  }
});

app.post('/follow', async (req, res) => {
  const { currentUserName, profileName, skillName } = req.body;

  try {
    const newFollow = new Follow({ currentUserName, profileName, skillName });
    await newFollow.save();
    res.status(201).json({ message: 'Follow successfully created!', follow: newFollow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving follow data', error });
  }
});

app.get('/api/blogs', async (req, res) => {
  const userName = req.query.userName; // The username is passed as a query parameter

  try {
    // Fetch blogs where the author’s name matches the username in the query
    const blogs = await Post.find({ name: userName }); // Adjust 'author' field if different in your schema
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ message: 'Error retrieving blogs' });
  }
});

app.post('/profile', async (req, res) => {
  const {
    name,
    currentJobRole,
    briefBio,
    skills

  } = req.body;
  try {
    const existingProfile = await Profile.findOne({ name });
    if (existingProfile) {
      res.status(400).send("Profile already exists");
    } else {
      const newProfile = new Profile({
        name,
        currentJobRole,
        briefBio,
        skills

      });
      await newProfile.save();
      res.status(201).json({ message: "Profile created successfully", profile: newProfile });
    }
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).send("Error processing profile creation");
  }
});

app.get('/current-user-profile', async (req, res) => {
  try {
    const userName = req.session.user.name; // Assuming session contains the user's ID
    const user = await Profile.findOne({ name: userName });
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Send user data back
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/signup', async (req, res) => {
  const { name, password } = req.body;

  try {
    const existingUser = await User.findOne({ name });

    if (existingUser) {
      res.status(400).send("User details already exist");
    } else {
      const hpassword = await bcrypt.hash(password, 5);
      console.log(hpassword)
      const newUser = new User({ name, password:hpassword, loggedIn: false });
      await newUser.save();
      res.status(201).json({ message: "Signup successful", user: newUser });
    }
  } catch (error) {
    res.status(500).send("Error processing signup");
  }
});
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.clearCookie('connect.sid');
    res.status(200).send("Logged out successfully");
  });
});


app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.status(200).json({ message: "Login successful", user });
    } else {
      res.status(400).json({ message: "Incorrect username or password" }); // Send JSON response
    }
  } catch (error) {
    res.status(500).json({ message: "Error processing login" }); // Send JSON response for server error
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
});

app.get('/current-user', (req, res) => {
  console.log(req.session);
  const currentUser = req.session?.user;

  if (currentUser) {
    res.status(200).json(currentUser);
  } else {
    res.status(401).send('User not authenticated');
  }
});

app.get('/user/:name', async (req, res) => {
  try {

    const user = await Profile.findOne({ name: req.params.name });


    console.log(user);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).send('Error retrieving user profile');
  }
});

app.get('/search-profiles', async (req, res) => {
  const { skill } = req.query;

  try {
    // Find profiles that match the specified skill
    const profiles = await Profile.find({
      'skills.skillName': skill, // Ensure this matches the structure of your database
    });

    if (profiles.length === 0) {
      return res.status(404).json({ message: 'No profiles found' });
    }

    // Fetch all users with scores and map usernames to scores
    const userScores = await User.find({}, 'name score');
    const scoreMap = userScores.reduce((map, user) => {
      map[user.name] = user.score;
      return map;
    }, {});

    // Attach score to each profile based on the username
    const profilesWithScores = profiles.map(profile => ({
      ...profile.toObject(),
      score: scoreMap[profile.name] || 0 // Add the score or 0 if not found
    }));

    // Sort profiles by score in descending order
    profilesWithScores.sort((a, b) => b.score - a.score);

    res.json({ skill, profiles: profilesWithScores }); // Send back profiles with scores in sorted order
  } catch (error) {
    console.error('Error searching profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/edit-profile', async (req, res) => {
  try {
    const { name, currentJobRole, briefBio, skills } = req.body;
    const userName = req.session.user.name; 

    
    const updatedUser = await Profile.findOneAndUpdate(
      { name: userName },
      {
        name,
        currentJobRole,

        briefBio,
        skills
      },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
