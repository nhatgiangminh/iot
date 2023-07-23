const { uploadImage } = require('../controllers/file');
const { uploadFile, getListFile, removeFile} = require('../controllers/handleFile');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

module.exports = (app, router) => {
  router.post('/file/upload-image', uploadImage);
  router.post('/file/upload-file/:classId', upload.single('file'), uploadFile);
  router.get('/file/:classId', getListFile);
  router.post('/file/:classId', removeFile);
  app.use('/v1', router);
};
