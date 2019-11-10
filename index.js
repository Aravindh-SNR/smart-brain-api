const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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

//getting all the users
app.get('/', (request, response) => {
    db.select('*').from('users').then(data => {
        response.json(data);
    });
});

//Sign in
app.post('/signin', (request, response) => {
    const {email, password} = request.body;

    db.select('email', 'hash').from('login').where({email}).then(data => {
        data.length && bcrypt.compareSync(password, data[0].hash) ?
        db.select('*').from('users').where({email}).then(data => {
            response.json(data[0]);
        })
        :
        response.json('Incorrect email or password, please try again.');
    });
});

//Sign up
app.post('/signup', (request, response) => {
    const {name, email, password} = request.body;
    db('users').insert({
        name,
        email,
        joined: new Date()
    }, ['*']).then(data => {
        bcrypt.hash(password, saltRounds, (error, hash) => {
            db('login').insert({
                email,
                hash
            }).then(() => {
                response.json(data[0]);
            });
        });
    }).catch(error => {
        error.constraint === 'users_email_key' &&
        response.json('Sorry, an account with the email you entered already exists.');
    });
})

//Getting one user
app.get('/profile/:id', (request, response) => {
    db.select('*').from('users').where({id: Number(request.params.id)}).then(data => {
        data.length ? response.json(data[0]) : response.json('User not found');
    });
});

//Updating the user's rank
app.put('/image', (request, response) => {
    const {id, score} = request.body;
    db.select('entries').from('users').where({id}).then(data => {
        data.length ?
        db('users').where({id}).update({entries: Number(data[0].entries) + score}, ['entries']).then(data => {
            response.json(data[0].entries);
        })
        :
        response.json('User not found');
    });
})

app.listen(8080);