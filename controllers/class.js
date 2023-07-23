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
const getClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const token = req.headers.authorization.split(' ')[1];
    const { role, _id } = jwt.verify(token, process.env.SECRET_KEY);
    let classR;
    if (!role.value === 'ADMIN') {
      classR = await Class.findOne({ _id: classId, students: { $in: [_id] } }).select('-__v').populate('students').populate('sessions');
    } else {
      classR = await Class.findById(classId).select('-__v').populate('students').populate('sessions');
    }
    if (classR) {
      return res.status(200).send({
        success: true,
        data: classR,
      });
    }
    return res.status(400).send({
      success: false,
      error: 'Lớp học không tồn tại!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      error: error.message,
    });
  }
};
const updateClass = async (req, res) => {
  try {
    const { body } = req;
    const { classId } = req.params;
    const classR = await Class.findByIdAndUpdate(classId, { ...body });
    console.log(classR);
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
const addSinhVien = async (req, res) => {
  try {
    const { body } = req;
    const { classId } = req.params;
    const classR = await Class.findById(classId);
    const commonEle = classR.students.filter((student) => body.listSinhVien.includes(student.toString()))
    if (commonEle.length) {
      return res.status(400).send({
        success: false,
        error: 'Sinh viên được thêm đã tồn tại!',
      });
    }
    classR.students = [...classR.students, ...body.listSinhVien];
    await classR.save();
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
module.exports = {
  createClass,
  getAllClasses,
  getClass,
  updateClass,
  addSinhVien,
};
