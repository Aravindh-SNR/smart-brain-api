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
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Pbv@90211sql',
      database : 'smart-brain'
    }
});

const app = express();

app.use(express.json());
app.use(cors());

//Getting all the users
//This endpoint is not currently being used in the front-end and is for future use
app.get('/', (request, response) => {
    //SELECT * FROM users
    db.select('*').from('users')
    .then(data => {
        response.json(data);
    })
    .catch(error => {
        response.status(400).json('Error getting users.');
    })
});

//Sign in
app.post('/signin', (request, response) => {
    const {email, password} = request.body;
    //SELECT email, hash FROM login WHERE email = email
    db.select('email', 'hash').from('login').where({email})
    .then(data => {
        //SELECT * FROM users WHERE email = email
        //if the password hashes match
        data.length && bcrypt.compareSync(password, data[0].hash) ?
        db.select('*').from('users').where({email})
        .then(data => {
            response.json(data[0]);
        })
        .catch(error => {
            response.status(400).json('Error signing in.');
        })
        :
        response.json('Incorrect email or password, please try again.');
    })
    .catch(error => {
        response.status(400).json('Error signing in.');
    });
});

//Sign up
app.post('/signup', (request, response) => {
    const {name, email, password} = request.body;
    //Using a transaction so that the insert query into login table will take effect
    //only if the insert query into users table is successful
    db.transaction(transaction => {
        //INSERT INTO users (name, email, joined) VALUES (name, email, new Date())
        db('users').insert({
            name,
            email,
            joined: new Date()
        }, ['*'])
        .transacting(transaction)
        .then(async data => {
            //INSERT INTO login (email, hash) VALUES (email, hash provided by the bcrypt library)
            await db('login').insert({
                email,
                hash: bcrypt.hashSync(password, SALT_ROUNDS)
            })
            .transacting(transaction);
            response.json(data[0]);
        })
        .then(transaction.commit)
        .catch(transaction.rollback);
    })
    .catch(error => {
        error.constraint === 'users_email_key' ?
        response.json('Sorry, an account with the email you entered already exists.')
        :
        response.status(400).json('Error signing up.');
    });
})

//Getting one user
//This endpoint is not currently being used in the front-end and is for future use
app.get('/profile/:id', (request, response) => {
    const {id} = request.params;
    //SELECT * FROM users WHERE id = id
    db.select('*').from('users').where({id})
    .then(data => {
        data.length ? response.json(data[0]) : response.json('User not found.');
    })
    .catch(error => {
        response.status(400).json('Error getting user.');
    })
});

//Updating the user's rank
app.put('/image', (request, response) => {
    const {id, score} = request.body;
    //UPDATE users SET entries = entries + score WHERE id = id
    db('users').where({id}).increment('entries', score).returning('entries')
    .then(data => {
        data.length ? response.json(data[0]) : response.json('User not found.');
    })
    .catch(error => {
        response.status(400).json('Error updating face count.');
    });
})

app.listen(8080);