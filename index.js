const express = require('express');
const cors = require('cors');

//For hashing passwords
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

//Query builder library to connect with postgres database
const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    }
});

const app = express();

app.use(express.json());
app.use(cors());

const users = require('./controllers/users');
const signIn = require('./controllers/signIn');
const signUp = require('./controllers/signUp');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

app.get('/', (request, response) => {response.send('The Smart-Brain app server is up and running!')});
app.get('/users', users.getAllUsers(db)); //This endpoint is not currently being used from the front-end and is for future use
app.get('/profile/:id', profile.getUserProfile(db));
app.post('/signin', signIn.handleSignIn(db, bcrypt));
app.post('/signup', signUp.handleSignUp(db, bcrypt, SALT_ROUNDS));
app.put('/image', image.updateEntries(db));
app.post('/detectface', image.handleApiCall);

app.listen(process.env.PORT || 3000);