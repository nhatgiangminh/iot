/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const http = require('http')
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { Server } = require('socket.io');
// const fileUpload = require('express-fileupload');

const bodyParser = require('body-parser');

const config = require('./config/index');
const logger = require('./utils/logger/index');
const connectDB = require('./lib/database');
const clientMqtt = require('./services/mqttService');
const SocketService = require('./services/socketService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:8181', 'http://raspberrypi'],
  },
});
const router = express.Router();
const loggerRequestMiddleware = require('./middlewares/logger_request');

global._io = io;

app.use(cors());
app.set('port', config.server.port || 3000);
app.use(loggerRequestMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// public thư mục public và tmp
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/tmp`));

// sử dụng upload tự tạo thư mục nếu chưa tồn tại
// app.use(fileUpload({ createParentPath: true }));

global._io.on('connection', SocketService.connection);

// run server
server.listen(app.get('port'), (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
  /* eslint-disable */
  // kêt nối db
  fs.readdirSync(path.join(__dirname, './models')).map((file) => {
    require(`./models/${file}`);
  });
  connectDB();

  // import Router
  fs.readdirSync(path.join(__dirname, './routes')).map((file) => {
    require(`./routes/${file}`)(app, router);
  });

  logger.info(
    `API is now running on port ${config.server.port} in ${config.server.environment} mode`,
  );
  logger.info(`connect mqtt: ${clientMqtt.connected}`)
});
module.exports = app;
