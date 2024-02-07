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
    account_email:account_email,
    messages:req.flash("notice")
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
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
    greeting: greeting
  });
}
  module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, showManagementView}
