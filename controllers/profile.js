//Getting one user

const getUserProfile = db => (request, response) => {
    const {id} = request.params;
    //SELECT * FROM users WHERE id = id
    db.select('*').from('users').where({id})
    .then(data => {
        data.length ? response.json(data[0]) : response.json('User not found.');
    })
    .catch(error => {
        response.status(400).json('Error getting user.');
    })
};

module.exports =  {
    getUserProfile
};