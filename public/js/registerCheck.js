let registerForm = document.getElementById("registration-form")
let emailAddressInput = document.getElementById("emailAddressInput");
let passwordInput = document.getElementById("passwordInput");
let errorDivs = document.getElementById("error");
let firstNameInput = document.getElementById("firstNameInput")
let lastNameInput = document.getElementById("lastNameInput")
let confirmPasswordInput = document.getElementById("confirmPasswordInput")
let majorInput = document.getElementById("majorInput")
let genderInput = document.getElementById("genderInput")
let birthDateInput = document.getElementById("birthDateInput")

const specialCharsWithoutNumbers = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
const checkSpaces = /\s/g;
const upperCase = /[A-Z]/g;
const numbers = /[0-9]/g;

  console.log("IN register")
  // export const majors = ["Computer Science", "Finance", "Chemistry"];
   const checkValidMajor = (strVal) => {
    if (!strVal) throw `Error: You must supply a input!`;
    if (typeof strVal !== "string") throw `Error: Input must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: Input cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: Input is not a valid value as it only contains digits`;
    return strVal;
  };
   const checkNameFormat = (strVal) => {
    if (!strVal) throw `Error: You must supply a input!`;
    if (typeof strVal !== "string") throw `Error: Input must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: Input cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: Input is not a valid value as it only contains digits`;
    if (strVal.length < 2 || strVal.length > 25)
      throw `Error: Input should be at least 2 characters long with a max of 25 characters`;
      if (strVal.match(specialCharsWithoutNumbers))
    throw `Error: Input cannot contain special characters`;
    return strVal;
  };
  
   const checkEmailAddress = (strVal) => {
    if (!strVal) throw `Email address can not be empty`;
    if (typeof strVal !== "string") throw "Email address must be a string";
    strVal = strVal.trim().toLowerCase();
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (!emailRegex.test(strVal)) throw `Error: Invalid format for email address`;
    return strVal;
  };
  
 
   const validPassword = (strVal) => {
    if (!strVal) throw "Password can not be empty";
    if (typeof strVal !== "string") throw "Password must be a string";
    if (strVal.length < 8) throw "Password must contain at least 8 characters";
    if (strVal.length > 25) throw "Password must contain at most 25 characters";
    if (strVal.match(checkSpaces)) throw `Password can not contain any spaces`;
    if (!strVal.match(upperCase))
      throw `Password must contain atleast one uppercase letter`;
    if (!strVal.match(numbers)) throw `Password must contain atleast one number`;
    if (!strVal.match(specialCharsWithoutNumbers))
      throw `Password must contain at least one special character`;
    return strVal;
  };

   const checkBirthDateFormat = (strVal) => {
    if (!strVal) throw `Error: You must supply a string}!`;
    if (typeof strVal !== "string") throw `Error: Each value must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: Input cannot be an empty string or string with just spaces`;
  
      if (strVal.slice(4, 5) !== "-" || strVal.slice(7, 8) !== "-")
      throw `Date must be in the dd/mm/yyyy format`;
  
      let month = Number(strVal.slice(5,7));
      let day = Number(strVal.slice(8));
      let year = Number(strVal.slice(0,4));
  
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year))
      throw `day, month and year must be numbers`;
    const date = new Date();
    const currentYear = date.getFullYear();
    if (year > currentYear - 15) throw `Must be at least 15 years old`;
    if (month < 1 || month > 12) throw `Month must be between 1-12`;
    if (day < 1 || day > 31) throw `Day must be between 1-31`;
    if (month === 2 && day > 28)
      throw `February can not contain more than 28 days`;
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      if (day > 30) throw `Date can not be 31 for this month `;
    }
    return strVal;
  };
  
   const checkValidArray = (arr) => {
    if (!arr || !Array.isArray(arr)) throw "Array must has length > 0";
    let res = [];
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i] || typeof arr[i] !== "string" || arr[i] === "")
        throw "Array must has valid string elements";
      res.push(arr[i].trim());
    }
    return res;
  };
  
   const validGender = (gender) => {
    if (
      !gender ||
      typeof gender !== "string" ||
      (gender.trim().toLowerCase() !== "male" &&
        gender.trim().toLowerCase() !== "female" &&
        gender.trim().toLowerCase() !== "prefer not to say")
    )
      throw "Gender is not valid";
    return gender.trim().toLowerCase();
  };

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      firstNameInput.classList.remove("inputClass");
      lastNameInput.classList.remove("inputClass");
      emailAddressInput.classList.remove("inputClass");
      passwordInput.classList.remove("inputClass");
      confirmPasswordInput.classList.remove("inputClass");
      genderInput.classList.remove("inputClass");
      birthDateInput.classList.remove("inputClass");
      majorInput.classList.remove("inputClass");
      errorDivs.hidden = true;
      var email = emailAddressInput.value;
      var confirmPassword = confirmPasswordInput.value
      var password = passwordInput.value;
      var firstName = firstNameInput.value;
      var lastName = lastNameInput.value;
      var gender = genderInput.value;
      var major = majorInput.value;
      var birthDate = birthDateInput.value;
      try {
        checkNameFormat(firstName);
      } catch (e) {
        event.preventDefault();
        console.log('here?');
        const message = typeof e === "string" ? e : e.message;
        errorDivs.textContent = message;
        errorDivs.hidden = false;
        firstNameInput.value = '';
        firstNameInput.classList.add("inputClass");
      }

      try {
        checkNameFormat(lastName);
      } catch (e) {
        event.preventDefault();
        const message = typeof e === "string" ? e : e.message;
        errorDivs.textContent = message;
        errorDivs.hidden = false;
        lastNameInput.value = "";
        lastNameInput.classList.add("inputClass");
      }

      try {
        checkEmailAddress(email);
      } catch (e) {
        event.preventDefault();
        const message = typeof e === "string" ? e : e.message;
        errorDivs.textContent = message;
        errorDivs.hidden = false;
        emailAddressInput.value = '';
        emailAddressInput.classList.add("inputClass");
      }
  
      try {
        validPassword(password);
      } catch (e) {
        event.preventDefault();
        const message = typeof e === "string" ? e : e.message;
        errorDivs.textContent = message;
        errorDivs.hidden = false;
        passwordInpu.valuet= '';
        passwordInput.classList.add("inputClass");
      }
      try {
        validPassword(confirmPassword);
      } catch (e) {
        event.preventDefault();
        const message = typeof e === "string" ? e : e.message;
        errorDivs.textContent = message;
        errorDivs.hidden = false;
        confirmPasswordInput.value ='';
        confirmPasswordInput.classList.add("inputClass");
      }

      try {
        validGender(gender);
      } catch (e) {
        event.preventDefault();
        const message = typeof e === "string" ? e : e.message;
        errorDivs.textContent = message;
        errorDivs.hidden = false;
        genderInput.value = '';
        genderInput.classList.add("inputClass");
      }

      try {
        checkBirthDateFormat(birthDate);
      } catch (e) {
        event.preventDefault();
        const message = typeof e === "string" ? e : e.message;
        errorDivs.textContent = message;
        errorDivs.hidden = false;
        birthDateInput.value = '';
        birthDateInput.classList.add("inputClass");
      }
      try {
        checkValidMajor(major);
      } catch (e) {
        event.preventDefault();
        const message = typeof e === "string" ? e : e.message;
        errorDivs.textContent = message;
        errorDivs.hidden = false;
        majorInput.value = '';
        majorInput.classList.add("inputClass");
      }
    });
  }