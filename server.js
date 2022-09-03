// ALL REQUIRES
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;
const db = require('./src/Models');



// CREATE SERVER APP
const app = express();

// ROUTERS
const authRoute = require('./src/Routes/AuthRoute/authRoute');


// MIDDLWARES ARRAY
const middlewares = [
    express.urlencoded({ extended: true }),
    express.json(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    helmet(),
    cors(),
    cookieParser()
];

app.use(middlewares);
app.use('/api/users', authRoute);

//
db.sequelize.sync({ force: false }).then(() => {
    console.log("DB HAS BEEN RE SYNC")
});


// ROOT API
app.get('/', (req, res) => {
    res.send('HELLO PRIME SERVER PARTS ❤️‍🔥');
});


// LISTEN APP
app.listen(PORT, () => {
    console.log(`LISTENING TO PORT: ${PORT}`);
});

