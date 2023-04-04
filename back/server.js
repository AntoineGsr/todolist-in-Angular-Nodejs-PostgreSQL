require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuration de la connexion à la base de données
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

//Vérification connexion à la DB
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données', err);
  } else {
    console.log('Connecté à la base de données PostgreSQL');
  }
});

app.use(bodyParser.json());
app.use(cors());

// Route pour récupérer toutes les tâches
app.get('/tasks', (req, res) => {
  pool.query('SELECT * FROM public.tasks', (err, results) => {
    if (err) throw err;
    res.send(results.rows);
  });
});

// Route pour ajouter une tâche
app.post('/tasks', (req, res) => {
  const task = req.body;
  pool.query('INSERT INTO tasks (name) VALUES ($1)', [task.name], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Route pour mettre à jour une tâche
app.put('/tasks/:id', (req, res) => {
  const task = req.body;
  pool.query('UPDATE tasks SET name = $1, status = $2 WHERE id = $3', [task.name, task.status, task.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Route pour supprimer une tâche
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM tasks WHERE id = $1', [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Récupération des tâches en fonction du statut
app.get('/tasks/getTaskByStatus/:idStatus', (req, res) => {
  const idStatus = req.params.idStatus;
  const sql = 'SELECT * FROM tasks WHERE status = $1';
  pool.query('SELECT * FROM tasks WHERE status = $1', [idStatus], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Erreur lors de la récupération des tâches par statut');
    } else {
      res.status(200).json(results.rows);
    }
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
