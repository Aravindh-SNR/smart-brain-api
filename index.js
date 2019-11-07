const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [],
    login: []
};

//getting all the users
app.get('/', (request, response) => {
    response.json(database.users);
});

//Sign in
app.post('/signin', (request, response) => {
    const {email, password} = request.body;
    const user = database.login.find(user => user.email === email && bcrypt.compareSync(password, user.hash));
    user ? response.json(database.users.find(myUser => myUser.id === user.id)) : response.status(404).json('User not found');
});

//Sign up
app.post('/signup', (request, response) => {
    const {name, email, password} = request.body;
    const id = database.users.length ? database.users[database.users.length - 1].id + 1 : 123;
    database.users.push({
        id,
        name,
        email,
        entries: 0,
        joined: new Date()
    });
    bcrypt.hash(password, saltRounds, (error, hash) => {
        database.login.push({
            id,
            email,
            hash
        });
    });
    response.json(database.users[database.users.length - 1]);
})

//Getting one user
app.get('/profile/:id', (request, response) => {
    const {id} = request.params;
    const user = database.users.find(user => user.id === Number(id));
    user ? response.json(user) : response.status(404).json('User not found');
});

//Updating the user's rank
app.put('/image', (request, response) => {
    const {id} = request.body;
    const user = database.users.find(user => user.id === id);
    user ? response.json(++user.entries) : response.status(404).json('User not found');
})

app.listen(8080);