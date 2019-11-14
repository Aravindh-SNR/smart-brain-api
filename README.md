API endpoints/backend for the Smart Brain app at [this repository](https://github.com/Aravindh-SNR/smart-brain)
Check the app live at https://smart-brain-app.netlify.com/

The backend has been built using:
- Node and Express
- PostgreSQL database

To run the project locally:
1. Clone the respository
2. Run npm install
3. Run npm start

Note:
- You will need to have postgreSQL installed in your system, and modify the 'db' variable in index.js referring to knex documentation
- You will have to add your own Clarifai API key in /controllers/image.js