// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountsController = require("../controllers/accountsController")

// Route to build inventory by classification view
router.get("/:<ACCOUNT_ID>", utilities.handleErrors(accounts.METHOD));

// Route to deliver a specific inventory item detail view

module.exports = router; 