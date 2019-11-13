//Signing up a user

const handleSignUp = (db, bcrypt, SALT_ROUNDS) => (request, response) => {
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
};

module.exports = {
    handleSignUp
};