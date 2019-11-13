//Signing in a user

const handleSignIn = (db, bcrypt) => (request, response) => {
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
};

module.exports = {
    handleSignIn
};