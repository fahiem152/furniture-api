
const AuthUserController = require('./controllers/AuthUserController');
const BrandController = require('./controllers/BrandController');
const CategoryController = require('./controllers/CategoryController');
const ProductController = require('./controllers/ProductController');
const RoleController = require('./controllers/RoleController');
const SupplierController = require('./controllers/SupplierController');
const UserController = require('./controllers/UserController');
const UserRoleController = require('./controllers/UserRoleController');
const IncomeProductController = require('./controllers/IncomeProductController');
const OrderController = require('./controllers/OrderController');
const _routes = [
    ['roles', RoleController],
    ['users', UserController],
    ['userRoles', UserRoleController],
    ['', AuthUserController],
    ['brands', BrandController],
    ['categories', CategoryController],
    ['products', ProductController],
    ['suppliers', SupplierController],
    ['incomeProducts', IncomeProductController],
    ['orders', OrderController]

];

const routes = (app) => {  
    _routes.forEach((route) => {
        const [url, controller] = route;
    
        // http://localhost:8000/api
        app.use(`/api/${url}`, controller);
      });
}

module.exports = routes;