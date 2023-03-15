const yup = require('yup');

exports.createCategoryValidate = yup.object().shape({
  name: yup.object().shape({
    en: yup.string().required('Category name is require!'),
    vn: yup.string().required('Category name is require!'),
  }),
  imageCategory: yup.string().nullable(true),
  isShow: yup.boolean(),
  active: yup.boolean(),
});

exports.updateCategoryValidate = yup.object().shape({
  name: yup.object().shape({
    en: yup.string(),
    vn: yup.string(),
  }),
  imageCategory: yup.string().nullable(true),
  isShow: yup.boolean(),
  active: yup.boolean(),
});
