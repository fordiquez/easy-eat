const router = require('express').Router();
const mealPlanController = require("controllers/meal-plan.controller");
const authorize = require("middlewares/authorize");
const Role = require("helpers/role.helper");

router.get('/', authorize(Role.Admin), mealPlanController.getAll);
router.post('/', authorize(Role.Admin), mealPlanController.createSchema, mealPlanController.create);
router.get('/:id', authorize(), mealPlanController.getById);
router.put('/:id', authorize(), mealPlanController.updateSchema, mealPlanController.update);
router.delete('/:id', authorize(), mealPlanController.delete);

module.exports = router
