const Sequelize= require('sequelize')

const connection = new Sequelize('guiapress','root','753951',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
})

module.exports = connection