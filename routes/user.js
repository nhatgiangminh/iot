const {
  login, createRefreshToken, changePassword, getProfile, createUser,
  checkRfid, updateUserRfid, getUsers, getUser,
} = require('../controllers/user');
const { authorize } = require('../middlewares/authorize');

module.exports = (app, router) => {
  router.post('/users/login', login);
  router.put('/users/change-password', authorize(['ADMIN', 'STUDENT', 'TEACHER']), changePassword);
  router.post('/auth/refresh-token', createRefreshToken);
  router.get('/users', authorize(['ADMIN', 'STUDENT', 'TEACHER']), getProfile);
  router.post('/users', authorize(['ADMIN']), createUser);
  router.get('/users/check-rfid', authorize(['ADMIN', 'STUDENT', 'TEACHER']), checkRfid);
  router.put('/users/update-rfid', authorize(['ADMIN']), updateUserRfid);
  router.get('/users/list', authorize(['ADMIN']), getUsers);
  router.get('/users/:userId', authorize(['ADMIN', 'STUDENT', 'TEACHER']), getUser);
  app.use('/v1', router);
};
