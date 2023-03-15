/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const YAML = require('yamljs');

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const bodyParser = require('body-parser');

const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger/schema.yaml'));
const swaggerMobileDocument = YAML.load(path.resolve(__dirname, './swagger/mobile.yaml'));
const swaggerUi = require('swagger-ui-express');

const config = require('./config/index');
const logger = require('./utils/logger/index');
const connectDB = require('./lib/database');

const app = express();
const router = express.Router();
const loggerRequestMiddleware = require('./middlewares/logger_request');

app.use(loggerRequestMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/tmp`));
app.use(fileUpload({ createParentPath: true }));

// run server
app.listen(config.server.port, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
  /* eslint-disable */
  fs.readdirSync(path.join(__dirname, './models')).map((file) => {
    require(`./models/${file}`);
  });
  connectDB();

  // import Router
  /* eslint-disable */
  fs.readdirSync(path.join(__dirname, './routes')).map((file) => {
    require(`./routes/${file}`)(app, router);
  });
  app.use('/api-docs/mobile', swaggerUi.serveFiles(swaggerMobileDocument), swaggerUi.setup(swaggerMobileDocument));
app.use('/api-docs', swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument));

  logger.info(
    `API is now running on port ${config.server.port} in ${config.server.environment} mode`,
  );
});

module.exports = app;
