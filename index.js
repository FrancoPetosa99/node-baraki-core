//--------------------------------  imports  --------------------------------
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./src/routes/routes');

//--------------------------------  App  --------------------------------
const app = express();

//--------------------------------  Middleware  --------------------------------
const cookieParser = require('cookie-parser');

//--------------------------------  Midelware  ---------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

//--------------------------------  Routes  -------------------------------
app.use('/api', routes);

//--------------------------------  Global Error Handler  -----------------------
app.use((error, request, response) => {
    const { statusCode, message, details, timestamp } = error;
    return response
    .status(statusCode)
    .json({ status: 'Error', statusCode, message, details, timestamp, path: request.originalUrl });
});

//--------------------------------  PORT  -------------------------------
const db = require('./src/config/db');

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', async () => {
    console.log('API running on port ' + PORT);
    try {
        await db.ping();
        console.log('Startup health check: DB connected');
    } catch (err) {
        console.warn('Startup health check: DB unavailable -', err.message || err);
    }
});
module.exports = app; 