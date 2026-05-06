const io = require('socket.io-client');
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Conectado al servidor de sockets para enviar prueba...');
    
    const notification = {
        title: '¡SISTEMA ACTIVO!',
        message: 'Los WebSockets están funcionando perfectamente en Lidus.',
        type: 'success'
    };

    socket.emit('notification', notification);
    console.log('Notificación enviada con éxito.');
    
    setTimeout(() => {
        console.log('Cerrando prueba.');
        process.exit(0);
    }, 1000);
});

socket.on('connect_error', (err) => {
    console.error('Error conectando al socket:', err.message);
    process.exit(1);
});
