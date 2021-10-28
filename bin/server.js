const db = require('../config/db');
const app = require('../app');

require('dotenv').config();
const UPLOAD_DIR = process.env.UPLOAD_DIR;
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;
const mkdirp = require('mkdirp');

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, async () => {
    await mkdirp(UPLOAD_DIR);
    await mkdirp(AVATAR_OF_USERS);
    console.log(`Server running. Using API on port: ${PORT}`);
  });
}).catch(error => {
  console.log(`Server run error. Error: ${error.message}`);
});
