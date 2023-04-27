/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const EventEmitter = require('events');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');
const clientMqtt = require('../services/mqttService');

const eventEmitter = new EventEmitter();
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne(
      {
        status: true,
        isDeleted: false,
        $or: [
          {
            code: username,
          },
        ],
      },
    ).populate('role', 'value');
    if (!user) {
      return res.status(400).send({
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
    const token = jwt.sign(
      { _id: user._id, role: user.role.value },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRE,
      },
    );
    const refreshToken = jwt.sign(
      { _id: user._id, role: user.role.value },
      process.env.SECRET_REFRESH_KEY,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRE,
      },
    );
    return res.status(200).send({
      success: true,
      data: {
        token,
        refreshToken,
      },
    });
  } catch (error) {
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
    const { _id, code, role } = verify;
    const token = jwt.sign({ _id, code, role }, process.env.SECRET_KEY, {
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
const createUser = async (req, res) => {
  try {
    const { body } = req;
    const role = await Role.findOne({ value: body.role });
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('12345678', salt);
    if (role) {
      await User.create({ ...body, role: role._id, password });
      return res.status(200).send({
        status: true,
      });
    }
    return res.status(400).send({
      success: false,
      error: 'Sai vai trò',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};
// const forgotPassword = async (req, res) => {
//   try {
//     const { phone, newPassword } = req.body;
//     const user = await User.findOne({ phone }).exec();
//     const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(newPassword, salt);
//     user.password = hashPassword;
//     await user.save();
//     return res.status(200).send({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     return res.status(400).send({
//       success: false,
//       error: error.message,
//     });
//   }
// };

const getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userCode = jwt.verify(token, process.env.SECRET_KEY);
    const userId = userCode._id;
    const userProfile = await User.findById(userId).select('-__v -password').populate('role', 'value');
    if (userProfile) {
      return res.status(200).send({
        status: true,
        data: userProfile,
      });
    }
    return res.status(400).send({
      status: false,
      error: 'User not found!',
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v -password').populate('role', 'value');
    if (users) {
      return res.status(200).send({
        status: true,
        data: users,
      });
    }
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // const user = res
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).send({
        status: true,
        data: user,
      });
    }
    return res.status(400).send({
      status: false,
      error: 'Người dùng không tồn tại',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const checkRfid = async (req, res) => {
  try {
    let mess;
    let timeOut;
    clientMqtt.subscribe('user/rfid/data');
    clientMqtt.publish('user/rfid', 'check');
    const token = req.headers.authorization.split(' ')[1];
    const userId = jwt.verify(token, process.env.SECRET_KEY)._id;
    const user = await User.findById(userId).select('-__v -password');
    console.log(clientMqtt.connected);
    clientMqtt.once('message', (topic, message) => {
      console.log(1);
      if (topic === 'user/rfid/data' && message) {
        const rfid = message.toString();
        if (user.rfid === rfid) {
          mess = {
            code: 200,
            status: true,
            data: user,
          };
          eventEmitter.emit('done', mess);
          clearTimeout(timeOut);
        } else {
          mess = {
            code: 400,
            status: false,
            error: 'Thẻ sinh viên không khớp',
          };
          eventEmitter.emit('done', mess);
          clearTimeout(timeOut);
        }
        clientMqtt.unsubscribe('user/rfid/data');
      }
    });
    timeOut = setTimeout(() => eventEmitter.emit('done'), 10000);
    const response = await new Promise((resolve) => { eventEmitter.once('done', resolve); });
    if (response) {
      return res.status(response.code).send({
        status: response.status,
        error: response?.error ?? false,
        data: response?.data ?? [],
      });
    }
    clientMqtt.removeAllListeners('message');
    return res.status(400).send({
      status: false,
      error: 'Không nhận được thông tin thẻ! Vui lòng thử lại',
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};
const updateUserRfid = async (req, res) => {
  try {
    clientMqtt.subscribe('user/rfid/data');
    clientMqtt.publish('user/rfid', 'check');
    // const token = req.headers.authorization.split(' ')[1];
    // const userId = jwt.verify(token, process.env.SECRET_KEY)._id;
    const { userId } = req.body;
    let mess;
    let timeOut;
    console.log(clientMqtt.connected);
    clientMqtt.once('message', async (topic, message) => {
      console.log(2);
      if (topic === 'user/rfid/data' && message) {
        const rfid = message.toString();
        const check = await User.findOne({ rfid });
        if (check) {
          mess = {
            code: 400,
            status: false,
            error: 'Mã rfid đã được sử dụng',
          };
          eventEmitter.emit('done', mess);
          clearTimeout(timeOut);
        } else {
          await User.findByIdAndUpdate(userId, { rfid });
          mess = {
            code: 200,
            status: true,
          };
          eventEmitter.emit('done', mess);
          clearTimeout(timeOut);
        }
      }
      clientMqtt.unsubscribe('user/rfid/data');
    });
    timeOut = setTimeout(() => eventEmitter.emit('done'), 10000);
    const response = await new Promise((resolve) => { eventEmitter.once('done', resolve); });
    if (response) {
      return res.status(response.code).send({
        status: response.status,
        error: response?.error ?? false,
      });
    }
    clientMqtt.removeAllListeners('message');
    return res.status(400).send({
      status: false,
      error: 'Không nhận được thông tin thẻ! Vui lòng thử lại',
    });
  } catch (error) {
    console.log(error);
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
  getProfile,
  createUser,
  checkRfid,
  updateUserRfid,
  getUsers,
  getUser,
};
