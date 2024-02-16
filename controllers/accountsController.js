const utilities = require("../utilities")
const accountModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const e = require("connect-flash")
const { authenticator } = require('otplib');
const QRCode = require('qrcode');

authenticator.options = {
  step: 30,
  window: 1,
  digits: 6,
};

require("dotenv").config()
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    let flashMessage = '';
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      messages: req.flash("notice") || ""
    })
  }
  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    let flashMessage = '';
    res.render("account/register", {
      title: "Register a New Account",
      nav,
      errors: null,
      messages:""
    })
  }
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
let hashedPassword
try {
  hashedPassword = await bcrypt.hash(account_password, 14)
} catch (error) {
  req.flash("Notice","Error")
  req.flash("Notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
    messages:req.flash("Notice")
  })
}
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "Notice",
        `Success`
      )
      req.flash(
        "Notice",
        `Congratulations, you\'re registered *${account_firstname}*. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: req.flash("Notice")
      })
    } else {
      req.flash("Notice", "Error Registering Account")
      req.flash("Notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        messages: req.flash("Notice")
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body; 
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Error Logging in");
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: account_email,
      messages: req.flash("notice")
    });
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      if (accountData.totp_enabled) {
        return res.render("account/verify-totp", {
          title: "Verify",
          nav,
          errors: null,
          account_id: accountData.account_id, 
          accountId: accountData.account_id,
          messages: ""
        });
      } else {
        console.log(accountData)
        const accessToken = jwt.sign({ ...accountData, totpVerified: false }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

        return res.redirect("/account")}
    } else {
      req.flash("notice", "Error Logging in");
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email: account_email,
        messages: req.flash("notice")
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("An error occurred during the login process.");
  }
 }

 async function showManagementView(req, res){
  let nav = await utilities.getNav()

  res.render("account/management",{
    title: "Account Manager",
    nav,
    messages: "",
  });
}

async function showUpdateView(req, res) {
  let nav = await utilities.getNav();
  const accountId = req.params.account_id
  const accountData = await accountModel.getAccountById(accountId);
  if (!accountData) {
    req.flash("errors", "Failed to retrieve account information.");
    return res.redirect("/account/update");
  }
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: req.flash("errors"),
    messages: req.flash("messages"),
    account: accountData,
    loggedin: true
  });
}

async function updateAccountInfo(req, res) {
  const firstName = req.body.account_firstname;
  const lastName = req.body.account_lastname;
  const email = req.body.account_email;
  const id = parseInt(req.body.account_id);
  try {
    await accountModel.updateAccountInfo(id, firstName, lastName, email);
    req.flash("messages", "Success.");
    req.flash("messages", "Account information updated successfully.");
    res.redirect("/account")

  } catch (error) {
    req.flash("errors", "Failed.");
    req.flash("errors", "Failed to update account information.");
    res.redirect("/account")}
}

async function updatePassword(req, res) {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.account_password;
  const id = parseInt(req.body.account_id);
  try {
    const accountData = await accountModel.getAccountById(id);
    if (await bcrypt.compare(currentPassword, accountData.account_password)) {
      const hashedPassword = await bcrypt.hash(newPassword, 14);
      await accountModel.updatePassword(id, hashedPassword);
      req.flash("messages", "Password updated successfully.");
      res.redirect("/account");
    } else {
      req.flash("errors", "Current password is incorrect.");
      res.redirect("/account");
    }
  } catch (error) {
    console.error("Error updating password:", error);
    req.flash("errors", "Failed to update password.");
    res.redirect("/account");
  }
}

async function setupTOTP(req, res) {
  let nav = await utilities.getNav();
  const accountId = req.params.account_id; 
  const totpSecret = await authenticator.generateSecret();
  try {
    const qrCodeURL = await QRCode.toDataURL(authenticator.keyuri(accountId, 'MyApp', totpSecret));
    console.log(totpSecret)
    req.session.totpSecret = totpSecret;
    res.render("account/setup-totp", {title: "Setup MFA", nav, qrCodeURL, messages: req.flash("messages") });
  } catch (error) {
    console.error("Error setting up TOTP:", error);
    req.flash("errors", "Failed to setup TOTP.");
    res.redirect("/account")
  }
}

async function verifyTOTPLogin(req, res) {
  let nav = await utilities.getNav();
  const accountId = req.params.account_id;
  const { totp_code } = req.body;
  const totpVerification = await accountModel.verifyTOTP(accountId, totp_code);
  if (totpVerification) {
    const accountData = await accountModel.getAccountById(accountId);
    delete accountData.account_password; // Remove password from account data
    const accessToken = await jwt.sign({ ...accountData, totpVerified: true }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    res.redirect("/account")
  } else {
    req.flash("errors", "Invalid TOTP code.");
    req.flash("errors", "Please enter a valid code.");
    res.render("account/verify-totp", {
      title: "Verify",
      nav: await utilities.getNav(),
      errors: null,
      accountId: accountId,
      messages: req.flash("errors")
    });
  }
}

async function verifyTOTPSetup(req, res) {
  let nav = await utilities.getNav();
  const accountId = req.params.account_id;
  const { totp_code } = req.body;
  const totpSecret = req.session.totpSecret; 
  if (authenticator.verify({ token: totp_code, secret: totpSecret })) {
    await accountModel.enableTOTP(accountId, totpSecret);
    delete req.session.totpSecret;
    req.flash("Success","Success")
    req.flash("Success","TOTP has been added to the account")
    res.redirect("/account")  } else {
    req.flash("Fail","Failed")
    req.flash("Fail","Invalid TOTP code")
    const qrCodeURL = await QRCode.toDataURL(authenticator.keyuri(accountId, 'MyApp', totpSecret));
    res.render("account/setup-totp", {title: "Setup MFA", nav, qrCodeURL, messages: req.flash("Fail") });
}
  }
module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, showManagementView, showUpdateView, updateAccountInfo, updatePassword, setupTOTP, verifyTOTPLogin, verifyTOTPSetup}

