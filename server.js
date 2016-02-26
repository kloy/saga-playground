'use strict'; // eslint-disable-line strict

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors());

let tagCount = 0;
let folderCount = 0;

app.get('/boxcar', (req, res) => {
  const body = {
    resource: 'GET /boxcar',
    time: Date.now(),
    tagCount,
    folderCount
  };

  console.log(body); // eslint-disable-line no-console

  res.json(body);
});

app.post('/boxcar', (req, res) => {
  if (req.body.tagCount) {
    tagCount = req.body.tagCount;
  }

  if (req.body.folderCount) {
    folderCount = req.body.folderCount;
  }

  const body = {
    resource: 'POST /boxcar',
    time: Date.now(),
    request_folderCount: req.body.folderCount,
    request_tagCount: req.body.tagCount,
    tagCount,
    folderCount
  };

  console.log(body); // eslint-disable-line no-console

  res.json(body);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!'); // eslint-disable-line no-console
});
