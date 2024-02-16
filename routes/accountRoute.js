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

// Route for TOTP setup page
router.get("/mfa/:account_id", utilities.checkLogin, utilities.handleErrors(accounts.setupTOTP));

// Route for TOTP verification during login
router.post("/login/mfa/:account_id", utilities.handleErrors(accounts.verifyTOTPLogin));

// Route to deliver account update view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accounts.showUpdateView));

// Route to process account information update
router.post("/update",
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

// Ensure TOTP verification route exists and is correct
router.post("/verify-totp-setup/:account_id", accounts.verifyTOTPSetup);

module.exports = router; 