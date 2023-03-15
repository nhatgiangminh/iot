/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const categoryConfigSchema = new Schema({
  name: {
    en: String,
    vn: String,
  },
  type: {
    type: String,
    enum: ['CATEGORY', 'PRODUCT', 'SLIDE', 'GROUP'],
  },
  showType: {
    type: String,
    enum: ['HORIZONTAL', 'VERTICLE', 'CAROUSEL', 'GROUP', 'CATEGORY'],
  },
  offset: {
    type: Number,
    default: 0,
  },
  items: [
    {
      type: String,
      require: true,
    },
  ],
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
categoryConfigSchema.virtual('imageCategoryPath').get(function () {
  if (this.imageCategory) { return `${process.env.IMAGE_URL}/category/${this._id}/${this.imageCategory}`; }
  return `${process.env.IMAGE_URL}/defaultAvatar.jpg`;
});

categoryConfigSchema.pre('save insertMany', function (next) {
  this.set({ createdAt: new Date().valueOf() });
  this.set({ updatedAt: new Date().valueOf() });
  next();
});
categoryConfigSchema.pre(['updateOne', 'findOneAndUpdate', 'updateOne', 'findByIdAndUpdate'], function (next) {
  this.set({ updatedAt: new Date().valueOf() });
  next();
});

module.exports = mongoose.model('CategoryConfig', categoryConfigSchema);
