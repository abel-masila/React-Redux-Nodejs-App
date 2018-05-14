const validator = require("validator");
const isEmpty = require("./isEmpty");
module.exports = function validateEducationInput(data) {
  let errors = {};

  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";

  if (validator.isEmpty(data.fieldOfStudy)) {
    errors.fieldOfStudy = "Field Of Study is required!";
  }
  if (validator.isEmpty(data.school)) {
    errors.school = "School field is required!";
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required!";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From field is required!";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
