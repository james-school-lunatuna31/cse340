// Adjusted checkValidationResults function to render views with errors

const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const utilities = require(".");

const validate = {};

// Validation rules for adding a new inventory item
validate.addInventoryItemRules = () => {
    return [
        body("classificationId")
            .trim()
            .isNumeric()
            .withMessage("Classification ID must be a number."),
        body("itemName")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Item name cannot be empty."),
        body("itemPrice")
            .trim()
            .isFloat({ min: 0.01 })
            .withMessage("Item price must be greater than 0."),
        body("make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Make cannot be empty."),
        body("model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Model cannot be empty."),
        body("year")
            .trim()
            .isInt({ min: 1900, max: new Date().getFullYear() })
            .withMessage("Year must be a valid year."),
        body("description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Description cannot be empty."),
        body("color")
            .trim()
            .isAlpha()
            .withMessage("Color must only contain letters."),
        body("miles")
            .trim()
            .isInt()
            .withMessage("Miles must only contain numbers."),
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
            classificationId: req.body.classificationId || null,
            itemName: req.body.itemName || null,
            itemPrice: req.body.itemPrice || null,
            make: req.body.make || null,
            model: req.body.model || null,
            year: req.body.year || null,
            description: req.body.description || null,
            color: req.body.color || null,
            miles: req.body.miles || null,
        });
        return;
    }
    next();
};

module.exports = validate;
