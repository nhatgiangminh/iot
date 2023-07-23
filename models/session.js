const mongoose = require('mongoose');

const { Schema } = mongoose;

const sessionSchema = new Schema({
  isActive: {
    type: Boolean,
    default: true,
  },
  attendance: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
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
sessionSchema.pre(['save', 'create'], function (next) {
  this.set({ createdAt: new Date().valueOf() });
  this.set({ updatedAt: new Date().valueOf() });
  next();
});
sessionSchema.pre(['findOneAndUpdate', 'updateOne', 'findByIdAndUpdate'], function (next) {
  this.set({ updatedAt: new Date().valueOf() });
  next();
});

module.exports = mongoose.model('Session', sessionSchema);
