const express = require('express')
const router = express.Router()
const foodsController = require('controllers/foods.controller')
const authorize = require("middlewares/authorize")

router.get('/', authorize(), foodsController.get);
router.post('/', authorize(), foodsController.createSchema, foodsController.create);
router.put('/:id', authorize(), foodsController.updateSchema, foodsController.update);
router.delete('/:id', authorize(), foodsController.delete);

module.exports = router
