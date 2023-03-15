/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const Role = require('../models/role');
const User = require('../models/user');

exports.authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return [
    (req, res, next) => {
      try {
        const bearerHeader = req.headers.authorization;
        if (!bearerHeader) {
          return res.status(401).send({
            success: false,
            error: 'Authenticate fail!',
          });
        }
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const verify = jwt.verify(bearerToken, process.env.SECRET_KEY);
        User.findById(verify._id).exec().then((user) => {
          if (!user) {
            return res.status(401).send({
              success: false,
              error: 'Authenticate fail!',
            });
          }
          Role.findById(user.role).then((role) => {
            if (!role) {
              return res.status(401).send({
                success: false,
                error: 'Authenticate fail!',
              });
            }
            if (roles.length && !roles.includes(role.value)) {
              return res.status(401).send({
                success: false,
                error: 'Authenticate fail!',
              });
            }
            next();
          });
        });
      } catch (error) {
        return res.status(401).send({
          success: false,
          error: error.message,
        });
      }
    },
  ];
};
