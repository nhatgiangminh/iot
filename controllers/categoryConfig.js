/* eslint-disable no-param-reassign */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
const { getUserId } = require('../lib');
const CategoryConfig = require('../models/categoryConfig');

const createCategoryConfig = async (req, res) => {
  try {
    const categoryIns = req.body;
    const userId = getUserId(req.headers.authorization);

    categoryIns.map((item) => {
      item.createdBy = userId;
      item.updatedBy = userId;
      item.createdAt = new Date().valueOf();
      item.updatedAt = new Date().valueOf();
      return item;
    });
    await CategoryConfig.insertMany(categoryIns);
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

const editCategoryConfig = async (req, res) => {
  try {
    const userId = getUserId(req.headers.authorization);
    const date = new Date().valueOf();
    const categoryConfigIns = req.body;
    const listCategoryConfigUpdate = categoryConfigIns.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: {
          $set: {
            name: item.name,
            type: item.type,
            showType: item.showType,
            offset: item.offset,
            items: item.items,
            updatedAt: date,
            updatedBy: userId,
          },
        },
      },
    }));
    await CategoryConfig.bulkWrite(listCategoryConfigUpdate);
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

const listCategoryConfig = async (req, res) => {
  try {
    const { lang, keywords } = req.query;
    const query = {};
    // tìm kiếm theo tên của category
    if (keywords) {
      if (keywords) {
        query.$or = [
          { 'name.en': { $regex: keywords, $options: 'i' } },
          { 'name.vn': { $regex: keywords, $options: 'i' } },
        ];
      }
    }
    const categoryConfig = await CategoryConfig.find(query)
      .sort({ offset: 1 })
      .select('-__v -isDeleted')
      .populate('createdBy updatedBy', 'fullName phone');

    // format data
    categoryConfig.map((item) => {
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
      data: categoryConfig,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const detailCategoryConfig = async (req, res) => {
  try {
    const { lang } = req.query;
    const { categoryConfigId } = req.params;
    const category = await CategoryConfig.findById(categoryConfigId)
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
  createCategoryConfig,
  editCategoryConfig,
  listCategoryConfig,
  detailCategoryConfig,
};
