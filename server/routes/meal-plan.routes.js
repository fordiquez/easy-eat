const router = require('express').Router();
const mealPlanController = require("controllers/meal-plan.controller");

router.get('/', mealPlanController.getAll);
router.post('/', mealPlanController.createSchema, mealPlanController.create);
router.get('/:id', mealPlanController.getById);
router.put('/:id', mealPlanController.updateSchema, mealPlanController.update);
router.delete('/:id', mealPlanController.delete);

module.exports = router
