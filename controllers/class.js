const jwt = require('jsonwebtoken');
const Class = require('../models/class');

const createClass = async (req, res) => {
  try {
    const { body } = req;
    await Class.create(body);
    return res.status(200).send({
      status: true,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};
const getAllClasses = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { role, _id } = jwt.verify(token, process.env.SECRET_KEY);
    let classes = [];
    if (role === 'ADMIN') {
      classes = await Class.find().populate('students');
    } else {
      classes = await Class.find({ students: _id }).populate('students');
    }
    return res.status(200).send({
      status: true,
      data: classes,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createClass,
  getAllClasses,
};
