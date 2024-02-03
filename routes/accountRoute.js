// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accounts = require("../controllers/accountsController")
const utilities = require("../utilities")


// Route to build login
router.get("/login", utilities.handleErrors(accounts.buildLogin));
//post registration
router.post('/register', utilities.handleErrors(accounts.registerAccount))
// Route to build register
router.get("/register", utilities.handleErrors(accounts.buildRegister));




module.exports = router; 