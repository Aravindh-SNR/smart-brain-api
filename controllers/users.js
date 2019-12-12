//Getting all the users

const getAllUsers = db => (request, response) => {
    //SELECT * FROM users ORDER BY 'id'
    db.select('*').from('users').orderBy('id')
    .then(data => {
        response.json(data);
    })
    .catch(error => {
        response.status(400).json('Error getting users.');
    })
};

module.exports = {
    getAllUsers
};