// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accounts = require("../controllers/accountsController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


// Route to build login
router.get("/login", utilities.handleErrors(accounts.buildLogin));
//post registration
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accounts.registerAccount)
  )
  // Route to build register
router.get("/register", utilities.handleErrors(accounts.buildRegister));
// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )



module.exports = router; 