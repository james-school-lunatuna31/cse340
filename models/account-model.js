const pool = require('../database/index');
const { authenticator } = require('otplib');
const QRCode = require('qrcode');

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

  /* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password, totp_enabled FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account ID
* ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password, totp_enabled FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
* Update account information
* ***************************** */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Update account password
* ***************************** */
async function updatePassword(account_id, account_password) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    return await pool.query(sql, [account_password, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Enable TOTP
* ***************************** */
async function enableTOTP(account_id, totp_secret) {
  try {
    const sql = "UPDATE account SET totp_secret = $1, totp_enabled = TRUE WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [totp_secret, account_id]);
    return result.rows[0]; // Return the updated account information
  } catch (error) {
    console.error("Error enabling TOTP:", error);
    throw error;
  }
}

/* *****************************
* Setup TOTP
* ***************************** */
async function setTOTPSecret(account_id, totp_secret) {
  try {
    const sql = "UPDATE account SET totp_secret = $1, totp_enabled = TRUE WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [totp_secret, account_id]);
    return result.rows[0]; // Return the updated account information
  } catch (error) {
    console.error("Error setting TOTP secret:", error);
    throw error; // Rethrow or handle as needed
  }
}

/* *****************************
* Verify TOTP
* ***************************** */
async function verifyTOTP(account_id, totp_code) {
  try {
    const sql = "SELECT totp_secret FROM account WHERE account_id = $1";
    const result = await pool.query(sql, [account_id]);
    if (result.rows.length > 0) {
      const { totp_secret } = result.rows[0];
      return authenticator.verify({ token: totp_code, secret: totp_secret });
    }
    return false; // Account not found or no TOTP secret
  } catch (error) {
    console.error("Error verifying TOTP:", error);
    return false; // In case of error, treat as verification failure
  }
}



module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail, 
  getAccountById, 
  updateAccountInfo, 
  updatePassword,
  enableTOTP,
  setTOTPSecret,
  verifyTOTP
};
