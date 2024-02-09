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
    return;
  }
  try {
    const existing = await pool.query(
      "SELECT * FROM public.classification WHERE classification_name = $1",
      [classificationName]
    );
    if (existing.rows.length > 0) {
      return "Classification already exists";
    }

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
 *  Insert a new inventory item into the database
 * ************************** */
async function addInventoryItem(formInput) {
  console.log(formInput);
    const query = `
        INSERT INTO public.inventory (
            classification_id, inv_make, inv_model, inv_year, 
            inv_description, inv_thumbnail, inv_color, inv_miles, inv_price, inv_image
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    const values = [
        formInput.classification_id,
        formInput.inv_make,
        formInput.inv_model,
        formInput.inv_year,
        formInput.inv_description,
        formInput.inv_thumbnail,
        formInput.inv_color,
        formInput.inv_miles,
        formInput.inv_price,
        formInput.inv_image
    ];

    try {
        await pool.query(query, values);
        console.log("Inventory item inserted successfully.");
    } catch (error) {
        console.error("Error inserting inventory item:", error);
    }
}

/* ***************************
 *  Check if a classification already exists in the database
 * ************************** */
async function checkExistingClassification(classificationName) {
  const existing = await pool.query(
    "SELECT * FROM public.classification WHERE classification_name = $1",
    [classificationName]
  );
  return existing.rows.length > 0;
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventoryItem, checkExistingClassification, updateInventory};
