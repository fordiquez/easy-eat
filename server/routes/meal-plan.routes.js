const router = require('express').Router();
const mealPlanController = require("controllers/meal-plan.controller");
const authorize = require("middlewares/authorize");
const Role = require("helpers/role.helper");

router.get('/', mealPlanController.getAll);
router.post('/', authorize(Role.Admin), mealPlanController.createSchema, mealPlanController.create);
router.get('/:id', mealPlanController.getById);
router.put('/:id', authorize(Role.Admin), mealPlanController.updateSchema, mealPlanController.update);
router.delete('/:id', authorize(Role.Admin), mealPlanController.delete);

module.exports = router
