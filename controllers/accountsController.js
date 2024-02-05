const utilities = require("../utilities")
const accountModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")

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
  module.exports = { buildLogin, buildRegister, registerAccount}
