const express = require('express')
const router = express.Router()
const foodsController = require('../controllers/foods.controller')
const authorize = require("middlewares/authorize")
const Role = require("helpers/role.helper")

router.get('/', authorize(), foodsController.get);
router.post('/', authorize(), foodsController.createSchema, foodsController.create);
// router.get('/:id', authorize(), accountController.getById);
router.put('/:id', authorize(), foodsController.updateSchema, foodsController.update);
router.delete('/:id', authorize(), foodsController._delete);

module.exports = router
