const express = require('express');
const router = express.Router();
const pool = require('../config/database'); 

// Para obtener todos los posts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT posts.*, autores.nombre AS autor_nombre, autores.email AS autor_email
      FROM posts
      JOIN autores ON posts.autor_id = autores.id
      ORDER BY posts.fecha_creacion DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Esto es para crear un nuevo post
router.post('/', async (req, res) => {
  const { titulo, descripcion, categoria, autor_id } = req.body;

  if (!titulo || !descripcion || !categoria || !autor_id) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO posts (titulo, descripcion, categoria, autor_id) VALUES (?, ?, ?, ?)',
      [titulo, descripcion, categoria, autor_id]
    );

    res.status(201).json({ message: 'Post creado', postId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
