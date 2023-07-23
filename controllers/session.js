const Session = require('../models/session');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Class = require('../models/class');
const EventEmitter = require('events');
const clientMqtt = require('../services/mqttService');

const eventEmitter = new EventEmitter();

const createSession = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    const { _id, role } = verify;
    const { body } = req;
    const session = await Session.create({ attendance: [_id], createdBy: _id });
    await Class.findByIdAndUpdate(body.classId, { $push: { sessions: session._id } });
    return res.status(200).send({
      success: true,
      data: session,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

// const getListSession = async (req, res) => {
//   try {
//     // const token = req.headers.authorization.split(' ')[1];
//     // const { role, _id } = jwt.verify(token, process.env.SECRET_KEY);
//     const sessions = await Session.find().populate('attendance');
//     return res.status(200).send({
//       status: true,
//       data: sessions,
//     });
//   } catch (error) {
//     return res.status(400).send({
//       success: false,
//       error: error.message,
//     });
//   }
// };

const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId).select('-__v').populate('attendance');

    if (session) {
      return res.status(200).send({
        success: true,
        data: session,
      });
    }
    return res.status(400).send({
      success: false,
      error: 'Buổi học không tồn tại!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { body } = req;
    await Session.findByIdAndUpdate(sessionId, body);
    return res.status(200).send({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

const checkIn = async (req, res) => {
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
      if (response.code === 200) {
        await Session.updateOne(
          { isActive: true, _id: req.params.sessionId, attendance: { $ne: userId } },
          { $push: { attendance: userId } },
        );
      }
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
module.exports = {
  createSession,
  checkIn,
  getSession,
  endSession,
};
