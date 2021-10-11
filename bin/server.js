const db = require('../config/db');
const app = require('../app');

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Using API on port: ${PORT}`);
  });
}).catch(error => {
  console.log(`Server run error. Error: ${error.message}`);
});
