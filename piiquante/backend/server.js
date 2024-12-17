
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

require('./db');

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const userController = require('./controllers/userController');

app.use('/api', userController);

const sauceController = require('./controllers/sauceController');

app.use('/api', sauceController);
