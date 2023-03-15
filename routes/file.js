const { uploadImage } = require('../controllers/file');

module.exports = (app, router) => {
  router.post('/file/upload-image', uploadImage);
  app.use('/v1', router);
};
