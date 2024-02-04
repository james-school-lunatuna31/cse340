const { body, validationResult } = require("express-validator");
const inventoryModel = require("../models/inventory-model");
const utilities = require(".");

const validate = {};

// Validation rules for adding a new classification
validate.addClassificationRules = () => {
    return [
        body("classificationName")
            .trim()
            .notEmpty()
            .withMessage("Classification name cannot be blank."),
        body("classificationName")
        .trim()
            .matches(/^\S*$/)
            .withMessage("Classification name cannot contain spaces."),
        body("classificationName")
            .custom(async (classificationName) => {
                const classificationExists = await inventoryModel.checkExistingClassification(classificationName);
                if (classificationExists) {
                    throw new Error("Classification already exists. Please use a different name.");
                }
            }),
    ];
};

// Function to check validation results and return errors or continue
validate.checkValidationResults = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        // Determine the appropriate view based on the route
        let view = "inventory/add-classification";
        res.render(view, {
            title: "Add New Classification",
            errors: errors,
            nav,
            classificationName: req.body.classificationName,
        });
        return;
    }
    next();
};

module.exports = validate;
