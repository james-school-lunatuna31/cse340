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

// Route to deliver account update view
router.get("/update", utilities.checkLogin, utilities.handleErrors(accounts.showUpdateView));

// Route to process account information update
router.post("/update/info",
            regValidate.updateInfoRules(),
            regValidate.checkUpdateInfo,
            utilities.handleErrors(accounts.updateAccountInfo));

// Route to process password update
router.post("/update/password",
            regValidate.updatePasswordRules(),
            regValidate.checkUpdatePassword,
            utilities.handleErrors(accounts.updatePassword));

// Route for logout process
router.get("/logout", (req, res) => {
  console.log("Logging out user");
  res.clearCookie("jwt");
  res.redirect("/account/login");
});

module.exports = router; 