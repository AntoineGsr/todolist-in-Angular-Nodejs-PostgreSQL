require('dotenv').config();
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();

const port = 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error: DB Connection', err);
  } else {
    console.log('DB Connection Successful');
  }
});

app.use(bodyParser.json());
app.use(cors());

app.get('/tasks', async (req, res) => {
  pool.query('SELECT * FROM public.tasks', (err, results) => {
    if (err) throw err;
    res.send(results.rows);
  });
});

app.post('/tasks', async (req, res) => {
  const task = req.body;
  pool.query('INSERT INTO tasks (name) VALUES ($1)', [task.name], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.put('/tasks/:id', async (req, res) => {
  const task = req.body;
  pool.query('UPDATE tasks SET name = $1, status = $2 WHERE id = $3', [task.name, task.status, task.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.delete('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM tasks WHERE id = $1', [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/tasks/getTaskByStatus/:idStatus', async (req, res) => {
  const idStatus = req.params.idStatus;
  pool.query('SELECT * FROM tasks WHERE status = $1', [idStatus], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error: getTaskByStatus');
    } else {
      res.status(200).json(results.rows);
    }
  });
});

app.put('/register', async (req, res) => {
  const user = req.params.user;
  const saltRounds = 10;

  user.password_hash = await bcrypt.hash(user.password_hash, saltRounds);
  pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [user.email, user.password_hash], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/login', async (req, res) => {
  console.log("inside login route")
  const user = req.body;
  const userDB = await pool.query('SELECT * FROM users WHERE email = $1', [user.email]);

  console.log("user: ", user.email, user.password_hash);
  console.log("userDB: ", userDB.rows[0].email, userDB.rows[0].password_hash);
  if (!userDB) {
    return res.status(401).json({ message: 'User does not exist' });
  } else {
    console.log("email valid => ", userDB.rows[0].email, user.email);
  }
  const isValidPassword = await bcrypt.compare(user.password_hash, userDB.rows[0].password_hash);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid password' });
  } else
    console.log("password valid => ", user.password_hash);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
