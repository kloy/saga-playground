'use strict'; // eslint-disable-line strict

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors());

let redCount = 0;
let blueCount = 0;

app.get('/boxcar', (req, res) => {
  const body = {
    resource: 'GET /boxcar',
    time: Date.now(),
    redCount,
    blueCount
  };

  console.log(body);

  res.json(body);
});

app.post('/boxcar', (req, res) => {
  if (req.body.redCount) {
    redCount = req.body.redCount;
  }

  if (req.body.blueCount) {
    blueCount = req.body.blueCount;
  }

  const body = {
    resource: 'POST /boxcar',
    time: Date.now(),
    request_blueCount: req.body.blueCount,
    request_redCount: req.body.redCount,
    redCount,
    blueCount
  };

  console.log(body);

  res.json(body);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
