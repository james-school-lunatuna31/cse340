// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const inventoryValidation = require('../utilities/inventory-validation');
const classificationValidation = require('../utilities/classification-validation'); 

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to deliver a specific inventory item detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to display the form for adding a new classification
router.get("/add-classification", utilities.handleErrors(invController.showAddClassificationView));

// Route to handle the form submission for adding a new classification
router.post("/add-classification", classificationValidation.addClassificationRules(), classificationValidation.checkValidationResults, utilities.handleErrors(invController.addClassification)); // Use classificationValidation

// Route to display the form for adding a new inventory item
router.get("/add-inventory", utilities.handleErrors(invController.showAddInventoryView));

// Route to handle the form submission for adding a new inventory item
router.post("/add-inventory", inventoryValidation.addInventoryItemRules(), inventoryValidation.checkValidationResults, utilities.handleErrors(invController.addInventoryItem)); 

// Route to display the inventory management view
router.get("/", utilities.checkLogin, utilities.handleErrors(invController.showManagementView));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to display the form for editing an inventory item
router.get("/edit/:inv_id", utilities.handleErrors(invController.showEditInventoryView));

// New route to handle the update inventory request with error handling
router.post("/update/", inventoryValidation.newInventoryRules(), utilities.handleErrors(invController.updateInventory));

module.exports = router; 
