let registerForm = document.getElementById("registration-form");
let emailAddressInput = document.getElementById("emailAddressInput");
let passwordInput = document.getElementById("passwordInput");
let errorDiv = document.getElementById("error");
let firstNameInput = document.getElementById("firstNameInput");
let lastNameInput = document.getElementById("lastNameInput");
let confirmPasswordInput = document.getElementById("confirmPasswordInput");
let majorInput = document.getElementById("majorInput");
let genderInput = document.getElementById("genderInput");
let birthDateInput = document.getElementById("birthDateInput");

// export const majors = ["Computer Science", "Finance", "Chemistry"];
const checkValidMajor = (strVal) => {
  let error_message = "";
  strVal = strVal.trim();
  if (!strVal) error_message = `Error: You must supply a input!`;
  if (typeof strVal !== "string")
    error_message = `Error: Input must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    error_message = `Error: Input cannot be an empty string or string with just spaces`;

  return error_message;
};
const checkNameFormat = (strVal) => {
  let error_message = "";
  if (!strVal) error_message = `Error: You must supply a input!`;
  if (typeof strVal !== "string")
    error_message = `Error: Input must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    error_message = `Error: Input cannot be an empty string or string with just spaces`;
  if (strVal.length < 2 || strVal.length > 25)
    error_message = `Error: Input should be at least 2 characters long with a max of 25 characters`;
  return error_message;
};

const checkEmailAddress = (strVal) => {
  let error_message = "";
  strVal = strVal.trim();
  if (!strVal) error_message = `Email address can not be empty`;
  if (typeof strVal !== "string")
    error_message = "Email address must be a string";
  strVal = strVal.trim().toLowerCase();
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  if (!emailRegex.test(strVal))
    error_message = `Error: Invalid format for email address`;
  return error_message;
};

const specialCharsWithoutNumbers = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
const checkSpaces = /\s/g;
const upperCase = /[A-Z]/g;
const numbers = /[0-9]/g;

const validPassword = (strVal) => {
  let error_message = "";
  if (!strVal) error_message = "Password can not be empty";
  if (typeof strVal !== "string") error_message = "Password must be a string";
  if (strVal.length < 8)
    error_message = "Password must contain at least 8 characters";
  if (strVal.length > 25)
    error_message = "Password must contain at most 25 characters";
  if (strVal.match(checkSpaces))
    error_message = `Password can not contain any spaces`;
  if (!strVal.match(upperCase))
    error_message = `Password must contain atleast one uppercase letter`;
  if (!strVal.match(numbers))
    error_message = `Password must contain atleast one number`;
  if (!strVal.match(specialCharsWithoutNumbers))
    error_message = `Password must contain at least one special character`;
  return error_message;
};

const checkBirthDateFormat = (strVal) => {
  let error_message = '';
  if (!strVal) error_message = `Error: You must supply a string}!`;
  if (typeof strVal !== "string")
    error_message = `Error: Each value must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    error_message = `Error: Input cannot be an empty string or string with just spaces`;

  if (strVal.slice(4, 5) !== "-" || strVal.slice(7, 8) !== "-")
    error_message = `Date must be in the (right format) dd/mm/yyyy format`;

  let month = Number(strVal.slice(5, 7));
  let day = Number(strVal.slice(8));
  let year = Number(strVal.slice(0, 4));

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year))
    error_message = `day, month and year must be numbers`;
  const date = new Date();
  const currentYear = date.getFullYear();
  if (year > currentYear - 15) error_message = `Must be at least 15 years old`;
  if (month < 1 || month > 12) error_message = `Month must be between 1-12`;
  if (day < 1 || day > 31) error_message = `Day must be between 1-31`;
  if (month === 2 && day > 28)
    error_message = `February can not contain more than 28 days`;
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    if (day > 30) error_message = `Date can not be 31 for this month `;
  }
  return error_message;
};

export const checkBirthDateFormat2 = (strVal) => {
  let error_message = '';
  if (!strVal) error_message = `Error: You must supply a string}!`;
  if (typeof strVal !== "string") error_message = `Error: Each value must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    error_message = `Error: Input cannot be an empty string or string with just spaces`;
  if (!moment(strVal, "YYYY-MM-DD", true).isValid()) {
    error_message = "Date must be in format of YYYY-MM-DD";
  }

  const currentTime = new Date();
  const date = currentTime.getFullYear().toString()
  if (strVal.slice(0, 4) > date - 15)
    error_message = "Age should larger than 15 years"

  return error_message;
};

const checkValidArray = (arr) => {
  let error_message = "";
  if (!arr || !Array.isArray(arr)) error_message = "Array must has length > 0";
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i] || typeof arr[i] !== "string" || arr[i] === "")
      error_message = "Array must has valid string elements";
    res.push(arr[i].trim());
  }
  return error_message;
};

const validGender = (gender) => {
  let error_message = "";
  if (
    !gender ||
    typeof gender !== "string" ||
    (gender.trim().toLowerCase() !== "male" &&
      gender.trim().toLowerCase() !== "female" &&
      gender.trim().toLowerCase() !== "prefer not to say")
  )
    error_message = "Gender is not valid";
  return error_message;
};

const validBothPassword = (passwordInput, confirmPasswordInput) => {
  let error_message = "";
  if (passwordInput.value !== confirmPasswordInput.value) {
    error_message = " Confirmed password should be equal to password ";
  }
  return error_message;
};

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    firstNameInput.classList.remove("inputClass");
    lastNameInput.classList.remove("inputClass");
    emailAddressInput.classList.remove("inputClass");
    passwordInput.classList.remove("inputClass");
    confirmPasswordInput.classList.remove("inputClass");
    majorInput.classList.remove("inputClass");
    genderInput.classList.remove("inputClass");
    birthDateInput.classList.remove("inputClass");
    errorDiv.hidden = true;
    event.preventDefault();

    let email = emailAddressInput.value;
    let confirmPassword = confirmPasswordInput.value;
    let password = passwordInput.value;
    let firstName = firstNameInput.value;
    let lastName = lastNameInput.value;
    let gender = genderInput.value;
    let major = majorInput.value;
    let birthDate = birthDateInput.value;

    if (checkNameFormat(firstName)) {
      firstNameInput.classList.add("inputClass");
      errorDiv.innerText = checkNameFormat(firstName);
      errorDiv.removeAttribute("hidden");
    }

    if (checkNameFormat(lastName)) {
      errorDiv.innerText = checkNameFormat(lastName);
      errorDiv.removeAttribute("hidden");
      lastNameInput.classList.add("inputClass");
    }

    if (checkEmailAddress(email)) {
      emailAddressInput.classList.add("inputClass");
      errorDiv.innerText = checkEmailAddress(email);
      errorDiv.removeAttribute("hidden");
    }

    if (validPassword(password)) {
      errorDiv.innerText = validPassword(password);
      errorDiv.removeAttribute("hidden");
      passwordInput.classList.add("inputClass");
    }

    if (validPassword(confirmPassword)) {
      errorDiv.innerText = validPassword(confirmPassword);
      errorDiv.removeAttribute("hidden");
      confirmPasswordInput.classList.add("inputClass");
    }

    if (validGender(gender)) {
      errorDiv.innerText = validGender(gender);
      errorDiv.removeAttribute("hidden");
      genderInput.classList.add("inputClass");
    }

    if (checkValidMajor(major)) {
      errorDiv.innerText = checkValidMajor(major);
      errorDiv.removeAttribute("hidden");
      majorInput.classList.add("inputClass");
    }

    if (checkBirthDateFormat2(birthDate)) {
      errorDiv.innerText = checkBirthDateFormat2(birthDate);
      errorDiv.removeAttribute("hidden");
      birthDateInput.classList.add("inputClass");
    }

    if (validBothPassword(passwordInput, confirmPasswordInput)) {
      errorDiv.innerText = validBothPassword(
        passwordInput,
        confirmPasswordInput
      );
      errorDiv.removeAttribute("hidden");
      passwordInput.classList.add("inputClass");
      confirmPasswordInput.classList.add("inputClass");
    }
  });
}
