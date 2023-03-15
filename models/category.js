/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    en: String,
    vn: String,
  },
  imageCategory: {
    type: String,
    default: null,
  },
  isShow: {
    type: Boolean,
    default: true,
  },
  active: {
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
    ref: 'User',
    default: null,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  toJSON: { getters: true },
  id: false,
});
categorySchema.virtual('imageCategoryPath').get(function () {
  if (this.imageCategory) { return `${process.env.IMAGE_URL}/category/${this._id}/${this.imageCategory}`; }
  return `${process.env.IMAGE_URL}/defaultAvatar.jpg`;
});

categorySchema.pre('save', function (next) {
  this.set({ createdAt: new Date().valueOf() });
  this.set({ updatedAt: new Date().valueOf() });
  next();
});
categorySchema.pre(['updateOne', 'findOneAndUpdate', 'updateOne', 'findByIdAndUpdate'], function (next) {
  this.set({ updatedAt: new Date().valueOf() });
  next();
});

module.exports = mongoose.model('Category', categorySchema);
