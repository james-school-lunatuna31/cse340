// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accounts = require("../controllers/accountsController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

router.get("/", utilities.checkLogin, utilities.handleErrors(accounts.showManagementView))
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
router.post("/login",
          regValidate.loginRules(),
          regValidate.checkLoginData,
          utilities.handleErrors(accounts.accountLogin));

module.exports = router; 