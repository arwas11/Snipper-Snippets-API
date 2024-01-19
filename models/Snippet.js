const {Sequelize} = require('sequelize')
const {db, Model, DataTypes} = require('../db/db')


class Snippet extends Model {};

Snippet.init({
    language: DataTypes.STRING,
    code: DataTypes.STRING,
},{
    sequelize: db,
    modelName: "Snippet"
})

module.exports = {
    Snippet
}