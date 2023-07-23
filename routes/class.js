const {
  createClass,
  getAllClasses,
  getClass,
  updateClass,
  addSinhVien,
} = require('../controllers/class');
const { authorize } = require('../middlewares/authorize');

module.exports = (app, router) => {
  router.post('/classes', authorize(['ADMIN']), createClass);
  router.get('/classes', authorize(['ADMIN', 'STUDENT', 'TEACHER']), getAllClasses);
  router.get('/classes/:classId', authorize(['ADMIN', 'STUDENT', 'TEACHER']), getClass);
  router.put('/classes/:classId', authorize(['ADMIN', 'TEACHER']), updateClass);
  router.put('/classes/:classId/add', authorize(['ADMIN', 'TEACHER']), addSinhVien);
  app.use('/v1', router);
};
