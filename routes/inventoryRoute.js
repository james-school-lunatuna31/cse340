// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const inventoryValidation = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to deliver a specific inventory item detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to display the form for adding a new classification
router.get("/add-classification", utilities.handleErrors(invController.showAddClassificationView));

// Route to handle the form submission for adding a new classification
router.post("/classification", inventoryValidation.addClassificationRules(), inventoryValidation.checkValidationResults, utilities.handleErrors(invController.addClassification));

// Route to display the form for adding a new inventory item
router.get("/add-inventory", utilities.handleErrors(invController.showAddInventoryView));

// Route to handle the form submission for adding a new inventory item
router.post("/add-inventory", inventoryValidation.addInventoryItemRules(), inventoryValidation.checkValidationResults, utilities.handleErrors(invController.addInventoryItem));

// Route to handle the form submission for adding a new inventory item
router.get("/", utilities.handleErrors(invController.showManagementView));

module.exports = router; 
