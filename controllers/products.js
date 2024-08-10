const path = require('path');
const User = require('../models/user.js');
const Cart = require('../models/cart.js');
const Product = require('../models/product.js');
const CourseProduct = require('../models/courseproduct.js');
const Contact = require('../models/contact.js');
const CartItem = require('../models/cartitem.js');

// Render the home page
exports.getHome = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views', 'shop.html'));
};

// Redirect to home page
exports.redirectHome = (req, res, next) => {
    res.redirect('/');
};

// Render the contact us page
exports.getContactUs = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views', 'contact-us.html'));
};

exports.getAddProductPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views', 'add-product.html'));
};

exports.getAllProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.json(products);
        })
        .catch(err => {
            console.log('Failed to retrieve products:', err);
            res.status(500).json({ error: 'Failed to retrieve products' });
        });
};

// Get product details by ID
exports.getProductDetail = (req, res, next) => {
    const productId = req.params.id;
    Product.findByPk(productId)
        .then(product => {
            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        })
        .catch(err => {
            console.log(`Failed to retrieve product with ID ${productId}:`,err);
            res.status(500).json({ error: 'Failed to retrieve product' });
        });
};
exports.getProductsPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views', 'products.html'));
};
exports.postAddToCart = async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; 

    try {
        let cartItem = await CartItem.findOne({ where: { productId: productId, cartId: userId } });

        if (cartItem) {
            cartItem.quantity += parseInt(quantity);
            await cartItem.save();
        } else {
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            cartItem = await CartItem.create({
                name: product.title, 
                image: product.imageUrl, 
                price: product.price,
                quantity: parseInt(quantity), 
                productId: product.id,
                cartId: userId
            });
        }

        res.json({ message: 'Product added to cart successfully' });
    } catch (err) {
        console.error('Error adding product to cart:', err);
        res.status(500).json({ message: 'Failed to add product to cart' });
    }
};

exports.postEditCartItem = async (req, res, next) => {
    const { productId, newQty } = req.body;

    try {
        const cartItem = await CartItem.findOne({ where: { productId: productId } });

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cartItem.quantity = parseInt(newQty);
        await cartItem.save();

        res.json({ message: 'Cart item updated successfully' });
    } catch (err) {
        console.error('Error updating cart item:', err);
        res.status(500).json({ message: 'Failed to update cart item' });
    }
};

exports.postRemoveFromCart = async (req, res, next) => {
    const { productId } = req.body;

    try {
        const cartItem = await CartItem.findOne({ where: { productId: productId } });

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cartItem.destroy();
        res.json({ message: 'Product removed from cart successfully' });
    } catch (err) {
        console.error('Error removing from cart:', err);
        res.status(500).json({ message: 'Failed to remove product from cart' });
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const cartItems = await CartItem.findAll();
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.json({ products: cartItems, totalPrice: totalPrice });
    } catch (err) {
        console.error('Error fetching cart data:', err);
        res.status(500).json({ message: 'Failed to retrieve cart data' });
    }
};

exports.getCartPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views', 'cart.html'));
};

exports.postAddContact = async (req, res, next) => {
    const { name, email, phone, date, time } = req.body;

    try {
        const newContact = await Contact.create({
            name: name,
            email: email,
            phone: phone,
            time: time,
            date: date,
        });

        res.redirect('/success'); 
    } catch (err) {
        console.error('Error saving contact:', err);
        res.status(500).json({ message: 'Failed to save contact' });
    }
};
// Render the success page
exports.getSuccess = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views', 'success.html'));
};

// Serve the 404 error page
exports.get404 = (req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '..', 'views', '404.html'));
};

// Fetch all products and render courses page
exports.getCourses = (req, res, next) => {
    CourseProduct.fetchProducts()
    .then(products => {
        res.sendFile(path.join(__dirname, '../views', 'courses.html'));
    })
    .catch(err => {
        console.error('Error fetching course products:', err);
        res.status(500).json({ error: 'Failed to retrieve course products' });
    });
};

exports.AddNewProduct = (req, res, next) => {
    console.log(req.body);
    const { id, title, price, imageUrl, description } = req.body;
    Product.create({
        id: id,
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
    .then(result => {
        console.log('Product created successfully:', result);
        res.status(201).json({ product: result });
    })
    .catch(err => {
        console.error('Error creating product:', err);
        res.status(500).send('Internal Server Error');
    });
};
