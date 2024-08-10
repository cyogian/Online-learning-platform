const {DataTypes} = require('sequelize');

const sequelize = require('../util/database.js');

const Product = sequelize.define('product',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title:{
       type:DataTypes.STRING,
       allowNull: false
    },
    price:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    imageUrl:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Product;
