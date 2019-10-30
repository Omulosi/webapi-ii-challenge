// implement your API here
const postRoutes = require('./postRoutes');

const express = require('express');
const port = 5000;

const server = express(); // creates the server
server.use(express.json());

server.use('/api/posts', postRoutes);


// watch for connections on port 5000
server.listen(5000, () =>
  console.log('Server running on http://localhost:5000')
);
