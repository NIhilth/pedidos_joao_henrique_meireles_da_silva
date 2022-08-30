const express = require('express');
const router = express.Router();
const users = require("./Users/users.controller");
const orders = require("./Orders/orders.controller");
const orderProducts = require("./OrderProducts/orderProducts.controller");
const products = require("./Products/products.controller");

router.use("/users", users)
router.use("/orders", orders)
router.use("/order-products", orderProducts)
router.use("/products", products)

module.exports = router;