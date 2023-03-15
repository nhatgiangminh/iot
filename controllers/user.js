/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger/index');

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne(
      {
        status: true,
        isDeleted: false,
        $or: [
          { phone },
          { userName: phone },
        ],
      },
    );
    if (!user) {
      return res.status(403).send({
        success: false,
        error: 'User not exist!',
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(403).send({
        success: false,
        error: 'password wrong!!!',
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.SECRET_REFRESH_KEY, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });
    return res.status(200).send({
      success: true,
      data: {
        token,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error(error);
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const createRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).send({
        status: false,
        message: 'Refresh token is required!!!',
      });
    }
    const verify = jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY);
    const { _id } = verify;
    const token = jwt.sign({ _id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.status(200).send({
      status: true,
      data: {
        token,
      },
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verify = jwt.verify(bearerToken, process.env.SECRET_KEY);
    const { _id } = verify;
    const user = await User.findById(_id);
    const check = await bcrypt.compare(oldPassword, user.password);
    if (!check) {
      return res.status(400).send({
        success: false,
        error: 'Mật khẩu cũ không đúng!',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    user.updatedBy = _id;
    await User.findByIdAndUpdate(_id, user);
    return res.status(200).send({
      success: true,
      message: 'Thay đổi mật khẩu thành công!',
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { phone, newPassword } = req.body;
    const user = await User.findOne({ phone }).exec();
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();
    return res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { lang } = req.query;
    const bearerToken = req.headers.authorization.split(' ')[1];
    const verify = jwt.verify(bearerToken, process.env.SECRET_KEY);
    const userId = verify._id;
    const user = await User.findById(userId).select('-password -__v').populate('role', '-__v ');
    const { fullName } = user;
    const roleName = user.role.text;
    if (lang === 'en') {
      user._doc.name = fullName.en;
      user.role._doc.text = roleName.en;
    } else {
      user._doc.name = fullName.vn;
      user.role._doc.text = roleName.vn;
    }
    delete user._doc.fullName;
    return res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  login,
  createRefreshToken,
  changePassword,
  forgotPassword,
  getProfile,
};
