// All Requires
const router = require('express').Router();
const signIn = require('../../Controllers/Auth/signin');
const { signOut } = require('../../Controllers/Auth/signout');
const signUp = require('../../Controllers/Auth/signup');
const saveUser = require('../../Middlewares/userAuth');

// signup endpoint
// passing the middleware function to the signup
router.post('/signup', saveUser, signUp);

// Sign In route
router.post('/signin', signIn);

// Sign Out route
router.post('/signout', signOut);

// Export
module.exports = router;
