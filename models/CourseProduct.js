const { DataTypes } = require('sequelize');
const sequelize = require('../util/database.js');

const CourseProduct = sequelize.define('courseProduct', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true 
    }
});

CourseProduct.fetchProducts = async () => {
    try {
        const products = await CourseProduct.findAll();
        return products;
    } catch (err) {
        console.error('Error fetching course products:', err);
        return [];
    }
};

CourseProduct.findProductById = async (id) => {
    try {
        const product = await CourseProduct.findByPk(id);
        return product;
    } catch (err) {
        console.error(`Error finding course product with ID ${id}:`, err);
        return null;
    }
};


module.exports = CourseProduct;
