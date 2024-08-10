const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const shopRoutes = require('./routes/shop');
const successRoutes = require('./routes/success');
const cartRoutes = require('./routes/cart'); 

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user = user;
        next();
    }).catch(err=>{console.log(err)});
})

app.use('/', shopRoutes);
app.use('/success' ,successRoutes);
app.use('/cart' ,cartRoutes); 

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart)
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

sequelize.sync({force: true})
.then(result => {
  return User.findByPk(1);
})
.then(user=>{
    console.log('reaching')
    if(!user){
        return User.create({name: 'FangLeng', email: 'fang@gmail.com'})
    }
    return user;
})
.then(user=>{
    return user.createCart();
})
.then(cart=>{
    app.listen(8000, () => {
        console.log('Server is running on port 8000');
    });
})
.catch(err => {
    console.log(err);
});