const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
app.use(bodyParser.json());

// Add CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

// Replace with your own connection string
const connectionString = 'mongodb+srv://jhony-33:Serafim12@cluster0.v4dsgzx.mongodb.net/';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('Sign');
    const usersCollection = db.collection('users');

    app.post('/signup', async (req, res) => {
      const userData = req.body;
    
      // Check if username or email already exist
      const user = await usersCollection.findOne({ $or: [{ username: userData.username }, { email: userData.email }] });
      if (user) {
        res.status(409).json({ error: 'Username or email already exists' });
      } else {
        // Insert the new user into the database
        usersCollection.insertOne(userData)
          .then(result => {
            res.sendStatus(201);
          })
          .catch(error => {
            console.error(error);
            res.sendStatus(500);
          });
      }
    });

    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch(error => console.error(error));