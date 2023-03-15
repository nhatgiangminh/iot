const {
  createCategory, editCategory, listCategory, detailCategory,
} = require('../controllers/category');
const {
  editCategoryConfig, detailCategoryConfig, createCategoryConfig, listCategoryConfig,
} = require('../controllers/categoryConfig');
const { createCategoryValidate, updateCategoryValidate } = require('../validates/category');
const { authorize } = require('../middlewares/authorize');
const validation = require('../middlewares/validation');

module.exports = (app, router) => {
  // category config
  router.put('/category/config', authorize(['CASHBACK_ADMIN', 'ADMIN']), editCategoryConfig);
  router.post('/category/config', authorize(['CASHBACK_ADMIN', 'ADMIN']), createCategoryConfig);
  router.get('/category/config', listCategoryConfig);
  router.get('/category/config/:categoryConfigId', detailCategoryConfig);

  // category
  router.put('/category/:categoryId', validation(updateCategoryValidate), authorize(['CASHBACK_ADMIN', 'ADMIN']), editCategory);
  router.get('/category/:categoryId', detailCategory);
  router.post('/category', validation(createCategoryValidate), authorize(['CASHBACK_ADMIN', 'ADMIN']), createCategory);
  router.get('/category', listCategory);
  app.use('/v1', router);
};
