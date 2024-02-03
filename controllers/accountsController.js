const utilities = require("../utilities")
const accountModel = require("../models/account-model.js")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    let flashMessage = '';
    res.render("account/login", {
      title: "Login",
      nav,
      flashMessage,
    })
  }
  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    let flashMessage = '';
    res.render("account/register", {
      title: "Register a New Account",
      nav,
      flashMessage,
    })
  }
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        flashMessage:'201'
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        flashMessage: 'error 501'

      })
    }
  }
  module.exports = { buildLogin, buildRegister, registerAccount}
