/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const classSchema = new Schema({
  name: String,
  description: String,
  amount: {
    type: Number,
    default: 70,
  },
  code: {
    type: String,
    unique: true,
  },
  time: {
    day: String,
    from: String,
    to: String,
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
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
// categorySchema.virtual('imageCategoryPath').get(function () {
//   if (this.imageCategory) { return `${process.env.IMAGE_URL}/category/${this._id}/${this.imageCategory}`; }
//   return `${process.env.IMAGE_URL}/defaultAvatar.jpg`;
// });

// classSchema.virtual('listFilePath').get(function() {
//   if (this.listFile) {
//     return `$`
//   }
// })

classSchema.pre('save', function (next) {
  this.set({ createdAt: new Date().valueOf() });
  this.set({ updatedAt: new Date().valueOf() });
  next();
});
classSchema.pre(['updateOne', 'findOneAndUpdate', 'updateOne', 'findByIdAndUpdate'], function (next) {
  this.set({ updatedAt: new Date().valueOf() });
  next();
});

module.exports = mongoose.model('Class', classSchema);
