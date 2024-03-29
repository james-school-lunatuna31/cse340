// Adjusted checkValidationResults function to render views with errors

const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const utilities = require(".");

const validate = {};

// Validation rules for adding a new inventory item
validate.addInventoryItemRules = () => {
    return [
        body("classification_id")
            .trim()
            .isNumeric()
            .withMessage("Classification ID must be a number."),
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Make cannot be empty."),
        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Model cannot be empty."),
        body("inv_year")
            .trim()
            .isInt({ min: 1900, max: new Date().getFullYear() })
            .withMessage("Year must be a valid year."),
        body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Description cannot be empty."),
        body("inv_color")
            .trim()
            .isAlpha()
            .withMessage("Color must only contain letters."),
        body("inv_miles")
            .trim()
            .isInt()
            .withMessage("Miles must only contain numbers."),
        body("inv_price")
            .trim()
            .isFloat({ min: 0.01 })
            .withMessage("Item price must be greater than 0."),
        body("inv_thumbnail")
            .trim()
            .matches(/\/images\/vehicles\/[^\/]+-tn\.[^\/]+/)
            .withMessage("Thumbnail must match the required pattern and not be blank."),
        body("inv_image")
            .trim()
            .matches(/\/images\/vehicles\/([^\/]+)\.([^\/]+)/)
            .withMessage("Image must match the required pattern and not be blank."),
    ];
};

// New validation rules for updating an inventory item
validate.newInventoryRules = () => {
    return [
        body("classification_id")
            .trim()
            .isNumeric()
            .withMessage("Classification ID must be a number."),
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Make cannot be empty."),
        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Model cannot be empty."),
        body("inv_year")
            .trim()
            .isInt({ min: 1900, max: new Date().getFullYear() })
            .withMessage("Year must be a valid year."),
        body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Description cannot be empty."),
        body("inv_color")
            .trim()
            .isAlpha()
            .withMessage("Color must only contain letters."),
        body("inv_miles")
            .trim()
            .isInt()
            .withMessage("Miles must only contain numbers."),
        body("inv_price")
            .trim()
            .isFloat({ min: 0.01 })
            .withMessage("Item price must be greater than 0."),
        body("inv_thumbnail")
            .trim()
            .matches(/\/images\/vehicles\/[^\/]+-tn\.[^\/]+/)
            .withMessage("Thumbnail must match the required pattern and not be blank."),
        body("inv_image")
            .trim()
            .matches(/\/images\/vehicles\/([^\/]+)\.([^\/]+)/)
            .withMessage("Image must match the required pattern and not be blank."),
    ];
};

// Function to check validation results and return errors or continue
validate.checkValidationResults = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        // Determine the appropriate view based on the route
        let view = "inventory/add-inventory"
        classifications = await invModel.getClassifications();
        console.log(req.body)
        res.render(view, {
            title: "Add New Inventory Item",
            errors: errors,
            nav,
            classifications: classifications.rows,
            classification_id: req.body.classification_id,
            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_description: req.body.inv_description,
            inv_color: req.body.inv_color,
            inv_miles: req.body.inv_miles,
            inv_price: req.body.inv_price,
            inv_thumbnail: req.body.inv_thumbnail,
            inv_image: req.body.inv_image,
        });
        return;
    }
    next();
};

module.exports = validate;
