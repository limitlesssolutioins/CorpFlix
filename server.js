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

    // Actualización de KPIs en vivo
    socket.on('kpi-update', (data) => {
      if (data.companyId) {
        io.to(data.companyId).emit('kpi-update', data);
      }
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

    // --- NUEVO SISTEMA DE SOPORTE SAAS (LIMITLESS) ---
    // Agente se conecta al panel de admins
    socket.on('join-saas-admins', () => {
      socket.join('saas-admins');
      console.log(`Agente ${socket.id} se unió a saas-admins`);
    });

    // Cliente pide hablar con un humano
    socket.on('request-human', (data) => {
      // data: { companyId, userId, userName }
      io.to('saas-admins').emit('human-requested', { ...data, socketId: socket.id });
      // El cliente se une a su propia sala de soporte
      socket.join(`support-${data.companyId}-${data.userId}`);
    });

    // Agente acepta el chat
    socket.on('agent-accept', (data) => {
      // data: { companyId, userId, agentName }
      const room = `support-${data.companyId}-${data.userId}`;
      socket.join(room);
      io.to(room).emit('agent-joined', { agentName: data.agentName });
    });

    // Mensaje entre cliente y agente en modo humano
    socket.on('saas-chat-message', (data) => {
      // data: { companyId, userId, text, sender: 'user' | 'agent' }
      const room = `support-${data.companyId}-${data.userId}`;
      io.to(room).emit('new-saas-message', data);
    });
    // -------------------------------------------------

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Servidor listo en http://${hostname}:${port}`);
    console.log(`> WebSockets activos (Socket.io)`);
  });
});
