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
    const classifications = await invModel.getClassifications();
    res.render("inventory/management", {
        title: "Management Console",
        nav,
        errors:null,
        messages: "",
        classifications: classifications.rows
    });

};


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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.showEditInventoryView = async function (req, res, next) {
  console.log(req.params.inv_id)
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let itemData = await invModel.getInventoryById(inv_id)
  itemData = itemData[0]
  const classifications = await invModel.getClassifications();
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications: classifications.rows,
    errors: null,
    selectedClassificationId: itemData.classification_id,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}
module.exports = invCont
