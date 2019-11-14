const Clarifai = require('clarifai');

//Clarifai face detection API
const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY
});

//Requesting Clarifai API for face data
const handleApiCall = (request, response) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, request.body.input)
    .then(data => {
        response.json(data);
    })
    .catch(error => {
        response.status(400).json('Please enter a valid image URL.');
    });
};

//Updating the user's entry count
const updateEntries = db => (request, response) => {
    const {id, score} = request.body;
    //UPDATE users SET entries = entries + score WHERE id = id
    db('users').where({id}).increment('entries', score).returning('entries')
    .then(data => {
        data.length ? response.json(data[0]) : response.json('User not found.');
    })
    .catch(error => {
        response.status(400).json('Error updating face count.');
    });
};

module.exports = {
    updateEntries,
    handleApiCall
};