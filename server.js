const express = require('express');
const cors = require('cors');
const autoresRoutes = require('./routes/autores');
const postsRoutes = require('./routes/posts');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

app.use('/api/autores', autoresRoutes);
app.use('/api/posts', postsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});



