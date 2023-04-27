const {
  createClass,
  getAllClasses,
} = require('../controllers/class');
const { authorize } = require('../middlewares/authorize');

module.exports = (app, router) => {
  router.post('/classes', authorize(['ADMIN']), createClass);
  router.get('/classes', authorize(['ADMIN', 'STUDENT', 'TEACHER']), getAllClasses);
  app.use('/v1', router);
};
