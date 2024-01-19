const {Sequelize} = require('sequelize')
const {db} = require('../db/db')
const {User} = require('./User')
const {Snippet} = require('./Snippet')

// Define Associations


module.exports = {
  db,
  User,
  Snippet
};
