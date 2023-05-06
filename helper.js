import moment from "moment";
import { ObjectId } from "mongodb";
import { major } from "./config/mongoCollections.js";

export const validStr = (str) => {
  if (!str) throw `Error: You must supply an input!`;
  if (typeof str !== "string") throw `Error: input must be a string!`;
  str = str.trim();
  if (str === "")
    `Error: input cannot be an empty string or string with just spaces`;
  return str;
};

export const validId = (id) => {
  id = validStr(id);
  if (!ObjectId.isValid(id)) throw `Error: invalid object ID`;
  return id;
};

export const validWeblink = (str) => {
  str = validStr(str);
  const web = /^www\..+\.com$/;
  if (!web.test(str.trim())) throw "not in a valid weblink format";
  return str;
};

export const validDate = (str) => {
  str = validStr(str);
  if (moment(str, "YYYY-MM-DD", true).format() === "Invalid date") {
    throw "invalid Date";
  }
  return str;
};

export const validTime = (str) => {
  str = validStr(str);
  const format = /^\d\d:\d\d:\d\d$/;
  if (!format.test(str)) throw "invalid Time";
  return str;
};

export const nonNegInt = (str) => {
  str = validStr(str);
  const num = Number(str);
  if (num === NaN || num < 0 || !Number.isInteger(num))
    throw "must be a non negative integer";
  return num;
};

const currentDate = () => {
  const currentTime = new Date();
  const date =
    currentTime.getFullYear().toString() +
    "-" +
    (currentTime.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    currentTime.getDate().toString().padStart(2, "0");
  return date;
};

const currentTime = () => {
  const currentTime = new Date();
  const time =
    currentTime.getHours().toString().padStart(2, "0") +
    ":" +
    (currentTime.getMinutes() + 1).toString().padStart(2, "0") +
    ":" +
    currentTime.getSeconds().toString().padStart(2, "0");
  return time;
};

export const validDueTime = (dueDate, dueTime) => {
  const due = new Date(dueDate + " " + dueTime);
  const current = new Date(currentDate() + " " + currentTime());
  return current.getTime() < due.getTime();
};

export const checkValidMajor = async (strVal) => {
  strVal = validStr(strVal).toLowerCase();
  const majorCollection = await major();
  const majorInfo = majorCollection.findOne({ major: strVal });
  if (majorInfo === null) throw "no such major";
  return strVal;
};
export const checkNameFormat = (strVal) => {
  if (!strVal) throw `Error: You must supply a input!`;
  if (typeof strVal !== "string") throw `Error: Input must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: Input cannot be an empty string or string with just spaces`;
  if (strVal.length < 2 || strVal.length > 25)
    throw `Error: Input should be at least 2 characters long with a max of 25 characters`;
  return strVal;
};

export const checkEmailAddress = (strVal) => {
  if (!strVal) throw `Email address can not be empty`;
  if (typeof strVal !== "string") throw "Email address must be a string";
  strVal = strVal.trim().toLowerCase();
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  if (!emailRegex.test(strVal)) throw `Error: Invalid format for email address`;
  return strVal;
};

const specialCharsWithoutNumbers = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
const checkSpaces = /\s/g;
const upperCase = /[A-Z]/g;
const numbers = /[0-9]/g;

export const validPassword = (strVal) => {
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

export const validRole = (strVal) => {
  if (!strVal) throw "Role can not be empty";
  if (typeof strVal !== "string") throw "Role must be a string";
  strVal = strVal.trim().toLowerCase();
  if (strVal !== "student" && strVal !== "faculty" && strVal !== "admin")
    throw `Error: Role can only be student, faculty or admin`;
  return strVal;
};

export const checkBirthDateFormat = (strVal) => {
  if (!strVal) throw `Error: You must supply a string}!`;
  if (typeof strVal !== "string") throw `Error: Each value must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: Input cannot be an empty string or string with just spaces`;

  if (strVal.slice(2, 3) !== "/" || strVal.slice(5, 6) !== "/")
    throw `Date must be in the dd/mm/yyyy format`;

  // let month = Number(strVal.slice(5, 7));
  // let day = Number(strVal.slice(8));
  // let year = Number(strVal.slice(0, 4));
  let [month, day, year] = strVal.split('/').map(Number);

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year))
    throw `day, month and year must be numbers`;
  const date = new Date();
  const currentYear = date.getFullYear();
  if (year > currentYear - 15) throw `Must be at least 15 years old`;
  // if(year < 1900) throw `Relese date can not be lower than 1900`;
  if (month < 1 || month > 12) throw `Month must be between 1-12`;
  if (day < 1 || day > 31) throw `Day must be between 1-31`;
  if (month === 2 && day > 28)
    throw `February can not contain more than 28 days`;
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    if (day > 30) throw `Date can not be 31 for this month `;
  }
  // if (!moment(strVal, "DD/MM/YYYY", true).isValid()) throw "not a valid date";
  return strVal;
};

export const checkValidArray = (arr) => {
  // if (!arr || !Array.isArray(arr) || arr.length === 0)
  if (!arr || !Array.isArray(arr)) throw "Array must has length > 0";
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i] || typeof arr[i] !== "string" || arr[i] === "")
      throw "Array must has valid string elements";
    res.push(arr[i].trim());
  }
  return res;
};

export const validGender = (gender) => {
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

export const validCWID = (id) => {
  if (
    !id ||
    typeof id !== "string" ||
    id.trim() === "" ||
    id.trim().length !== 8
  )
    throw "id should be a valid string of length 8";
  return id.trim();
};

export default {
  checkValidMajor,
  checkNameFormat,
  checkEmailAddress,
  validPassword,
  // validRole,
  checkBirthDateFormat,
  // checkNumberFormat,
  validCWID,
  validGender,
};

// checkStringArray(arr, varName) {
//   //We will allow an empty array for this,
//   //if it's not empty, we will make sure all tags are strings
//   if (!arr || !Array.isArray(arr))
//     throw `You must provide an array of ${varName}`;
//   for (let i in arr) {
//     if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
//       throw `One or more elements in ${varName} array is not a string or is an empty string`;
//     }
//     arr[i] = arr[i].trim();
//   }

//   return arr;
