'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const router = express.Router();

// Public Routes

router.get('/', (req, res) => {
	res.json({ message: 'hooray! welcome to our api!' });
});

// Start Server

const app = express();
app.use(bodyParser.json());
app.use('/api', router);
app.listen(port);

console.log(`Starting TC Centers API on port ${port}`);
