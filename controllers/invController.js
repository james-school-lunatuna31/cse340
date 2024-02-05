const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const inventoryValidation = require('../utilities/inventory-validation');
const classificationValidation = require('../utilities/classification-validation');


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid
  })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryById(inventory_id)
  const detail = await utilities.buildInventoryDetail(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
  })
}

/* ***************************
 *  Show management view
 * ************************** */
invCont.showManagementView = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
        title: "Management Console",
        nav,
        errors:null,
        messages: ""
    });

};

module.exports = invCont

// Render the Add New Classification view
invCont.showAddClassificationView = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors:null
    });
};

// Handle the form submission for adding a new classification
invCont.addClassification = async function(req, res, next) {
  await invModel.addClassification(req.body.classificationName);
  req.flash("success","Success")
  req.flash('success', 'Classification added successfully.'); 
  let nav = await utilities.getNav();
  res.render("inventory/management",{
    title: "Management Console",
    nav,
    messages: req.flash("success")
  });
};

// Render the Add New Inventory Item view
invCont.showAddInventoryView = async function(req, res, next) {
    let nav = await utilities.getNav()
    const classifications = await invModel.getClassifications();
    res.render("inventory/add-inventory", {
        title: "Add New Inventory Item",
        nav,
        errors:null,
        classifications: classifications.rows
    });
};

// Handle the form submission for adding a new inventory item
invCont.addInventoryItem = async function(req, res, next) {
    let nav = await utilities.getNav()
    await invModel.addInventoryItem(req.body);
    req.flash("success","Success")
    req.flash('success', 'Inventory item added successfully.'); 
    res.render("inventory/management",{
      title: "Management Console",
      nav,
      messages: req.flash("success")
    });
};
