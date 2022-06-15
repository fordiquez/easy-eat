const router = require('express').Router();
const mealPlanController = require("controllers/meal-plan.controller");
const Role = require("utils/role");
const authorize = require("middlewares/authorize");

router.get('/', mealPlanController.getAll);
router.post('/', authorize(Role.Admin), mealPlanController.createSchema, mealPlanController.create);
router.get('/:id', mealPlanController.getById);
router.put('/:id', authorize(Role.Admin), mealPlanController.updateSchema, mealPlanController.update);
router.delete('/:id', authorize(Role.Admin), mealPlanController.delete);

module.exports = router
