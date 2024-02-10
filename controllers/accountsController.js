const utilities = require("../utilities")
const accountModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
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
// Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
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
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice","Error Logging in")
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: account_email,
      messages: req.flash("notice")
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    } else {
      // Password does not match
      req.flash("notice", "Error Logging in")
      req.flash("notice", "Please check your credentials and try again.")
      res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email: account_email,
        messages: req.flash("notice")
      })
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("An error occurred during the login process.");
  }
 }

 async function showManagementView(req, res){
  let nav = await utilities.getNav()

  const token = req.cookies.jwt;
  let accountData;

  if (token) {
    try {
      // Decode the token to get the payload
      accountData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      // Handle error (token verification failed, token expired, etc.)
      console.error("Token verification failed:", error);
      return res.status(403).send("Access Forbidden");
    }
  }

  // Ensure accountData is defined and has account_firstname
  if (!accountData || !accountData.account_firstname) {
    return res.status(403).send("Access Forbidden");
  }

  let greeting = "Welcome " + accountData.account_firstname; 
  res.render("account/management",{
    title: "Account Manager",
    nav,
    messages: "",
    greeting: greeting,
    user: accountData, // Pass the user object to the view
    clientIsLoggedIn: true // Ensure clientIsLoggedIn is passed to views
  });
}

// New functions for account update view and handling account updates and password changes
async function showUpdateView(req, res) {
  let nav = await utilities.getNav();
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: req.flash("errors"),
    messages: req.flash("messages")
  });
}

async function updateAccountInfo(req, res) {
  const { firstName, lastName, email } = req.body;
  try {
    await accountModel.updateAccountInfo(req.user.id, firstName, lastName, email);
    req.flash("messages", "Account information updated successfully.");
    res.redirect("/account/update");
  } catch (error) {
    console.error("Error updating account info:", error);
    req.flash("errors", "Failed to update account information.");
    res.redirect("/account/update");
  }
}

async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  try {
    const accountData = await accountModel.getAccountById(req.user.id);
    if (await bcrypt.compare(currentPassword, accountData.account_password)) {
      const hashedPassword = await bcrypt.hash(newPassword, 14);
      await accountModel.updatePassword(req.user.id, hashedPassword);
      req.flash("messages", "Password updated successfully.");
      res.redirect("/account/update");
    } else {
      req.flash("errors", "Current password is incorrect.");
      res.redirect("/account/update");
    }
  } catch (error) {
    console.error("Error updating password:", error);
    req.flash("errors", "Failed to update password.");
    res.redirect("/account/update");
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, showManagementView, showUpdateView, updateAccountInfo, updatePassword}
