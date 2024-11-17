const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route for rendering the signup page
router.get('/signup', userController.renderSignup);

// Route for handling signup form submission
router.post('/signup', userController.signup);

// Route for rendering the login page
router.get('/login', userController.renderLogin);

// Route for handling login form submission
router.post('/login', userController.login);

// Route for logging out
router.get('/logout', userController.logout);

module.exports = router;