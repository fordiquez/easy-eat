const express = require('express');
const router = express.Router();
const accountController = require("controllers/accounts.controller");
const Role = require("utils/role");
const uploadAvatar = require('utils/avatars-storage');
const authorize = require("middlewares/authorize");

router.post('/authenticate', accountController.authenticateSchema, accountController.authenticate);
router.post('/refresh-token', accountController.refreshToken);
router.post('/register', accountController.registerSchema, accountController.register);
router.post('/verify-email', accountController.verifyEmailSchema, accountController.verifyEmail);
router.post('/forgot-password', accountController.forgotPasswordSchema, accountController.forgotPassword);
router.post('/validate-reset-token', accountController.validateResetTokenSchema, accountController.validateResetToken);
router.post('/reset-password', accountController.resetPasswordSchema, accountController.resetPassword);
router.post('/revoke-token', authorize(), accountController.revokeTokenSchema, accountController.revokeToken);
router.get('/', authorize(Role.Admin), accountController.getAll);
router.post('/', authorize(Role.Admin), accountController.createSchema, accountController.create);
router.get('/:id', authorize(), accountController.getById);
router.put('/:id', authorize(), accountController.updateSchema, accountController.update);
router.delete('/:id', authorize(), accountController.delete);
router.post('/upload/:id', authorize(), uploadAvatar.single('file'), accountController.uploadAvatar);
router.get('/avatar/:id', accountController.getAvatar);
router.get('/avatar/:id/:filename', accountController.updatedAvatar);
router.delete('/avatar/:id', authorize(), accountController.deleteAvatar);

module.exports = router
