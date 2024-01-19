const {Sequelize} = require('sequelize')
const {db, Model, DataTypes} = require('../db/db')


class User extends Model {};

User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
},{
    sequelize: db,
    modelName: "User"
})

module.exports = {
    User
}