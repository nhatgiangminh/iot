class SocketService {
  //connection socket
  connection(socket) {
    console.log(`user ${socket.id} connected`);
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
    });
    socket.on('video', (imageBytes) => {
      const decode = Buffer.from(imageBytes).toString('base64');
      socket.broadcast.emit('streaming', decode);
    });
    socket.on('request', () => {
      console.log('request');
      socket.broadcast.emit('request-stream');
    });
    socket.on('cancel-stream', () => {
      console.log('cancel');
      socket.broadcast.emit('cancel');
    });
  }
}
module.exports = new SocketService();
