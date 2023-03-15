const {
  login, createRefreshToken, changePassword, forgotPassword, getProfile,
} = require('../controllers/user');
const { authorize } = require('../middlewares/authorize');

module.exports = (app, router) => {
  router.post('/users/login', login);
  router.put('/users/change-password', authorize(['ADMIN', 'CUSTOMER', 'PARTNER', 'CASHBACK_ADMIN']), changePassword);
  router.post('/users/forgot-password', forgotPassword);
  router.post('/auth/refresh-token', createRefreshToken);
  router.get('/users', authorize(['ADMIN', 'CUSTOMER', 'PARTNER', 'CASHBACK_ADMIN']), getProfile);
  app.use('/v1', router);
};
