/*
 * Copyright (c) 2014-2021 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */




/* jslint node: true */
const fs = require('fs')
const path = require('path')
const sequelizeNoUpdateAttributes = require('sequelize-noupdate-attributes')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  retry: {
    match: [
      /SQLITE_BUSY/
    ],
    name: 'query',
    max: 5
  },
  transactionType: 'IMMEDIATE',
  storage: 'data/juiceshop.sqlite',
  logging: false
})
sequelizeNoUpdateAttributes(sequelize)
const db = {}

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db



exports.loginHandler2 = function (req, res, next) {
  if (validator.isEmail(req.body.username)) {
    User.find({ username: req.body.username, password: req.body.password }, function (err, users) {
if (users.length > 0) {
        const redirectPage = req.body.redirectPage
        const session = req.session
        const username = req.body.username
        return adminLoginSuccess(redirectPage, session, username, res)
      } else {
        return res.status(401).send()
      }
    });
  } else {
    return res.status(401).send()
  }
};
