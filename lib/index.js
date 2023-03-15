/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger/index');

// hàm lấy userId từ token
exports.getUserId = (authorization) => {
  try {
    const bearerToken = authorization.split(' ')[1];
    const verify = jwt.verify(bearerToken, process.env.SECRET_KEY);
    return verify._id;
  } catch (error) {
    logger.error(error);
    return null;
  }
};
