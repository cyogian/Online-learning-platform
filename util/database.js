const { Sequelize } = require('sequelize');
const fs = require('fs')

const {
    DIALECT,
    DB_NAME,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
} = process.env

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DIALECT,
    dialectOptions: {
        ssl: {
            ca: fs.readFileSync(__dirname + '/mysql-ca.pem')
        }
    },
});

async function verify() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

verify();

module.exports = sequelize;