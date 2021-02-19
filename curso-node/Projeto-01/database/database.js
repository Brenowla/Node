const Sequelize  = require('sequelize')

const connection = new Sequelize('guiaperguntas','root','753951',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection