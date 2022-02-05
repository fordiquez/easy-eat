const express = require('express');
const router = express.Router();
const accountController = require("../controllers/accounts.controller");
const productController = require('../controllers/products.controller')
const authorize = require("middlewares/authorize");
const Role = require("helpers/role.helper");

// router.get('/', authorize(), accountController.getAll);
router.post('/', authorize(), productController.create);
// router.get('/:id', authorize(), accountController.getById);
// router.put('/:id', authorize(), accountController.updateSchema, accountController.update);
// router.delete('/:id', authorize(), accountController._delete);

module.exports = router
