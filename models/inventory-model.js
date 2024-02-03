const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get a specific inventory item by inventory_id
 * ************************** */
async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}

/* ***************************
 *  Add a new classification to the database
 * ************************** */
async function addClassification(classificationName) {
  if (classificationName.trim() === '') {
    // If the classification name is blank, do not add anything
    return;
  }
  try {
    const result = await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *",
      [classificationName]
    );
    return result.rows[0]; // Return the inserted classification
  } catch (error) {
    console.error("Error adding classification: " + error);
    throw error; // Rethrow the error for the caller to handle
  }
}

/* ***************************
 *  Add a new inventory item to the database
 * ************************** */
async function addInventory(classification_id, item_name, quantity) {
  try {
    const result = await pool.query(
      "INSERT INTO public.inventory (classification_id, item_name, quantity) VALUES ($1, $2, $3) RETURNING *",
      [classification_id, item_name, quantity]
    );
    return result.rows[0]; // Return the inserted inventory item
  } catch (error) {
    console.error("Error adding inventory: " + error);
    throw error; // Rethrow the error for the caller to handle
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory};
