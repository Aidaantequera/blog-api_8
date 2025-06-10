const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM autores');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


// Esta parte es para crear un nuevo autor
router.post('/', async (req, res) => {
    const { nombre, email, imagen } = req.body;
  
    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y email son obligatorios' });
    }
  
    try {
      const [result] = await pool.query(
        'INSERT INTO autores (nombre, email, imagen) VALUES (?, ?, ?)',
        [nombre, email, imagen || null]
      );
      res.status(201).json({ id: result.insertId, nombre, email, imagen });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


  // Obtener todos los posts de un autor
router.get('/:id/posts', async (req, res) => {
    const autorId = req.params.id;
  
    try {
      const [rows] = await pool.query(`
        SELECT posts.*, autores.nombre AS autor_nombre, autores.email AS autor_email
        FROM posts
        JOIN autores ON posts.autor_id = autores.id
        WHERE autores.id = ?
        ORDER BY posts.fecha_creacion DESC
      `, [autorId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No se encontraron posts para este autor' });
      }
  
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  