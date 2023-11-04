/* istanbul ignore file */
const { Client } = require('pg');

const pgclient = new Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: 'developer',
  password: 'supersecretpassword',
  database: 'forumapi_test'
});

pgclient.connect();