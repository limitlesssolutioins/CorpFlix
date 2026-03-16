const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Unirse a una empresa (Sala privada)
    socket.on('join-company', (companyId) => {
      socket.join(companyId);
      console.log(`Socket ${socket.id} se unió a la empresa: ${companyId}`);
    });

    // Notificaciones Genéricas
    socket.on('notification', (data) => {
      // Si viene con companyId, se envía solo a esa empresa. Si no, a todos.
      if (data.companyId) {
        io.to(data.companyId).emit('notification', data);
      } else {
        io.emit('notification', data);
      }
      console.log('Notificación procesada:', data.title);
    });

    // Notificaciones de progreso
    socket.on('task-progress', (data) => {
      // data: { companyId, taskId, progress, message }
      io.to(data.companyId).emit('progress-update', data);
    });

    // Eventos de Chat de Soporte
    socket.on('send-message', (data) => {
      // data: { companyId, text, sender: 'user' | 'ia' | 'agent' }
      io.to(data.companyId).emit('new-message', data);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Servidor listo en http://${hostname}:${port}`);
    console.log(`> WebSockets activos (Socket.io)`);
  });
});
