const checkEmailAddress = (strVal) => {
  if (!strVal) throw `Email address can not be empty`;
  if (typeof strVal !== "string") throw "Email address must be a string";
  strVal = strVal.trim().toLowerCase();
  if (
    !strVal.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  )
    throw `Error: Invalid format for email address`;
  return strVal;
};

const specialCharsWithoutNumbers = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
const checkSpaces = /\s/g;
const upperCase = /[A-Z]/g;
const numbers = /[0-9]/g;

const validPassword = (strVal) => {
  if (!strVal) throw "Password can not be empty";
  if (typeof strVal !== "string") throw "Password must be a string";
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw "Password cannot be an empty string or just spaces";
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

const form = document.getElementById("login-form");
const emailAddressInput = document.getElementById("emailAddressInput");
const passwordInput = document.getElementById("passwordInput");
const errorDivs = document.getElementById("error");

if (form) {
  form.addEventListener("submit", async (event) => {
    emailAddressInput.classList.remove("inputClass");
    passwordInput.classList.remove("inputClass");
    errorDivs.hidden = true;
    try {
      var email = emailAddressInput.value;
      var pwd = passwordInput.value;
      checkEmailAddress(email);
      validPassword(pwd);
    } catch (e) {
      event.preventDefault();
      const message = typeof e === "string" ? e : e.message;
      errorDivs.textContent = message;
      errorDivs.hidden = false;
      emailAddressInput.value = email;
      emailAddressInput.classList.add("inputClass");
      passwordInput.classList.add("inputClass");
      if (checkEmailAddress(email)) {
        emailAddressInput.classList.remove("inputClass");
      }
      if (validPassword(pwd)) {
        passwordInput.classList.remove("inputClass");
      }
    }
  });
}
