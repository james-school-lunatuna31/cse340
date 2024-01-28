const utilities = require("../utilities");

const errorController = {};

errorController.handleError = async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message = 'Oh no! There was a crash.';
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
};

module.exports = errorController;
