const router = require('express').Router();
const userDataController = require("controllers/user-data.controller");
const Role = require("utils/role");
const authorize = require("middlewares/authorize");

router.get('/', authorize(Role.Admin), userDataController.getAll);
router.post('/', authorize(), userDataController.createSchema, userDataController.create);
router.get('/:id', authorize(), userDataController.getById);
router.put('/:id', authorize(), userDataController.updateSchema, userDataController.update);
router.delete('/:id', authorize(), userDataController.delete);

module.exports = router
