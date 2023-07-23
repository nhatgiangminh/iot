const { authorize } = require('../middlewares/authorize');
const {
  createSession,
  getSession,
  checkIn,
  endSession,
} = require('../controllers/session');

module.exports = (app, router) => {
  router.post('/session', authorize(['ADMIN', 'TEACHER']), createSession);
  router.get('/session/:sessionId', getSession);
  router.put('/session/:sessionId', authorize(['ADMIN', 'TEACHER']), endSession);
  router.get('/session/check-in/:sessionId', checkIn);
  app.use('/v1', router);
};
