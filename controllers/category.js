/* eslint-disable no-param-reassign */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
const { getUserId } = require('../lib');
const Category = require('../models/category');
const { saveImage, changeImage } = require('./file');

const createCategory = async (req, res) => {
  try {
    const categoryIns = req.body;
    const userId = getUserId(req.headers.authorization);
    categoryIns.createdBy = userId;
    categoryIns.updatedBy = userId;
    const category = await Category.create(categoryIns);

    // di chuyển ảnh từ tmp vào thư mục category
    if (categoryIns.imageCategory) {
      saveImage({
        id: category._id,
        fileSave: { category: categoryIns.imageCategory },
      });
    }
    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const editCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const categoryIns = req.body;
    const fileSave = {};

    categoryIns.updatedBy = getUserId(req.headers.authorization);
    const category = await Category.findByIdAndUpdate(categoryId, categoryIns);

    // cập nhật ảnh category mới
    if (categoryIns.imageCategory) {
      fileSave.category = {
        newFile: categoryIns.imageCategory,
        oldFile: category.imageCategory,
      };
      changeImage({
        id: category._id,
        fileSave,
      });
    }

    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const listCategory = async (req, res) => {
  try {
    const {
      lang, page, limit, keywords,
    } = req.query;
    const perPage = parseInt(limit || 10);
    const currentPage = parseInt(page || 1);
    const query = {};

    // tìm kiếm theo tên của category
    if (keywords) {
      query.$or = [
        { 'name.en': { $regex: keywords, $options: 'i' } },
        { 'name.vn': { $regex: keywords, $options: 'i' } },
      ];
    }
    const category = await Category.find(query)
      .sort({ _id: -1 })
      .select('-__v -isDeleted')
      .populate('createdBy updatedBy', 'fullName phone')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    const total = await Category.countDocuments(query);
    const totalPage = Math.ceil(total / perPage);

    // format data
    category.map((item) => {
      if (lang === 'en') {
        item._doc.categoryName = item.name.en;
        item._doc.createdBy._doc.name = item.createdBy.fullName.en;
        item._doc.updatedBy._doc.name = item.updatedBy.fullName.en;
      } else {
        item._doc.categoryName = item.name.vn;
        item._doc.createdBy._doc.name = item.createdBy.fullName.vn;
        item._doc.updatedBy._doc.name = item.updatedBy.fullName.vn;
      }
      delete item._doc.name;
      return item;
    });

    return res.status(200).send({
      success: true,
      data: category,
      paging: {
        page: currentPage,
        limit: perPage,
        total,
        totalPage,
      },
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const detailCategory = async (req, res) => {
  try {
    const { lang } = req.query;
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId)
      .populate('createdBy updatedBy', 'fullName phone')
      .select('-__v -isDeleted');

    // format data
    if (lang === 'en') {
      category._doc.categoryName = category.name.en;
      category._doc.createdBy._doc.name = category.createdBy.fullName.en;
      category._doc.updatedBy._doc.name = category.updatedBy.fullName.en;
    } else {
      category._doc.categoryName = category.name.vn;
      category._doc.createdBy._doc.name = category.createdBy.fullName.vn;
      category._doc.updatedBy._doc.name = category.updatedBy.fullName.vn;
    }
    return res.status(200).send({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  editCategory,
  listCategory,
  detailCategory,
};
