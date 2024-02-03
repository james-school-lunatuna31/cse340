// Adjusted checkValidationResults function to render views with errors

const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const utilities = require(".");

const validate = {};

// Validation rules for adding a new inventory item
validate.addInventoryItemRules = () => {
    return [
        body("itemName")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Item name cannot be empty."),
        body("itemPrice")
            .trim()
            .isFloat({ min: 0.01 })
            .withMessage("Item price must be greater than 0.")
    ];
};

// Validation rules for adding a new classification
validate.addClassificationRules = () => {
    return [
        body("classificationName")
        // I want this to be annoying. No spaces, no trim
            .matches(/^\S*$/)
            .withMessage("Classification name cannot contain a space.")
    ];
};

// Function to check validation results and return errors or continue
validate.checkValidationResults = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        // Determine the appropriate view based on the route
        let view = req.path.includes('inventory') ? 'inventory/add-inventory' : 'inventory/add-classification';
        let title = view.includes('add-inventory') ? 'Add New Inventory Item' : 'Add New Classification';
        res.render(view, {
            title: title,
            errors: errors,
            nav,
            itemName: req.body.itemName || null,
            itemPrice: req.body.itemPrice || null,
            classificationName: req.body.classificationName || null,
        });
        return;
    }
    next();
};

module.exports = validate;
