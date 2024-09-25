
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const salas = {};


io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('chatMessage', (message) => {
    io.emit('chatMessage', message);
  });
  
  socket.on('unirseASala', (salaId) => {
    if (!salas[salaId]) {

      const seed = Math.floor(Math.random() * 100);
      salas[salaId] = { seed, clientes: new Set() };
    }


    socket.join(salaId);
    salas[salaId].clientes.add(socket.id);
    socket.emit('seed', salas[salaId].seed);
    socket.to(salaId).emit('usuarioUnido', `${socket.id} se unió a la sala`);
    console.log(`El usuario ${socket.id} se unió a la sala ${salaId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);

    for (const salaId in salas) {

      if (salas[salaId].clientes.has(socket.id)) {
        salas[salaId].clientes.delete(socket.id);
        socket.to(salaId).emit('usuarioDesconectado', `${socket.id} se desconectó`);
        console.log(`El usuario ${socket.id} se desconectó de la sala ${salaId}`);

        if (salas[salaId].clientes.size === 0) {
          delete salas[salaId];
          console.log(`La sala ${salaId} fue eliminada`);
        }

        break;
      }
    }
  });
});
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


