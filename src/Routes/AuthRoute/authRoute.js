// All Requires
const router = require('express').Router();
const signIn = require('../../Controllers/Auth/signin');
const signUp = require('../../Controllers/Auth/signup');
const saveUser = require('../../Middlewares/userAuth');

// signup endpoint
// passing the middleware function to the signup
router.post('/signup', saveUser, signUp);

// login route
router.post('/signin', signIn);

//
module.exports = router;
