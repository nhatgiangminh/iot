/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const Role = require('./role');

const { data } = require('../config/data');

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    en: String,
    vn: String,
  },
  avatar: {
    type: String,
    default: null,
  },
  birthday: String,
  gender: {
    type: Number,
    enum: [0, 1, 2],
    default: 2,
  },
  phone: {
    type: String,
    unique: true,
  },
  userName: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    default: null,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: String,
  updatedAt: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    default: null,
  },
}, {
  toJSON: { getters: true },
  id: false,
});

// trường ảo
userSchema.virtual('avatarPath').get(() => {
  if (this.avatar) { return `${process.env.IMAGE_URL}user/${this.id}/avatar/${this.avatar}`; }
  return `${process.env.IMAGE_URL}/defaultAvatar.jpg`;
});

// tự lưu ngày tạo và ngày cập nhật lúc tạo
userSchema.pre('save', function (next) {
  this.set({ createdAt: new Date().valueOf() });
  this.set({ updatedAt: new Date().valueOf() });
  next();
});

// tự cập nhật ngày cập nhật gần nhất khi chỉ sửa
userSchema.pre(['updateOne', 'findOneAndUpdate', 'findByIdAndUpdate'], function (next) {
  this.set({ updatedAt: new Date().valueOf() });
  next();
});

const User = mongoose.model('User', userSchema);

// tạo data ban đầu từ data  trong mục config
async function initUser() {
  // create role
  const role = await Role.find();
  const listValueRole = Array.from(role, ({ value }) => value);
  const listRoleCreate = data.role.filter((item) => !listValueRole.includes(item.value));
  if (listRoleCreate.length > 0) {
    await Role.insertMany(listRoleCreate);
  }

  // create user
  const user = await User.find();
  const listPhoneUser = Array.from(user, ({ phone }) => phone);
  const listUserCreate = data.user.filter((item) => !listPhoneUser.includes(item.phone));
  if (listUserCreate.length > 0) {
    const roleId = await Role.find();
    const roleKey = roleId.reduce((acc, cur) => {
      const id = cur.value;
      return { ...acc, [id]: cur };
    }, {});
    listUserCreate.map((item) => {
      item.role = roleKey[item.role]._id;
      return item;
    });
    await User.insertMany(listUserCreate);
  }
}
initUser();
module.exports = User;
