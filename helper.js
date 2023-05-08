import moment from "moment";
import { ObjectId } from "mongodb";
import { major } from "./config/mongoCollections.js";

const specialCharsWithoutNumbers = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
const checkSpaces = /\s/g;
const upperCase = /[A-Z]/g;
const numbers = /[0-9]/g;

export const validStr = (str) => {
  if (!str) throw `Error: You must supply an input!`;
  if (typeof str !== "string") throw `Error: input must be a string!`;
  str = str.trim();
  if (str === "")
    throw `Error: input cannot be an empty string or string with just spaces`;
  return str;
};

export const validId = (id) => {
  id = validStr(id);
  // console.log(ObjectId.isValid(id));
  if (!ObjectId.isValid(id)) throw "Error: invalid object ID";
  return id;
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
  if (due.getTime() < current.getTime()) throw "not valid due time";
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
    if (strVal.match(specialCharsWithoutNumbers))
    throw `Error: Input cannot contain special characters`;
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
  if (!moment(strVal, "YYYY-MM-DD", true).isValid()) {
    throw "Date must be in format of YYYY-MM-DD";
  }

  const currentTime = new Date();
  const date = currentTime.getFullYear().toString()
  if (strVal.slice(0, 4) > date - 15)
    throw "Age should larger than 15 years"

  return strVal;
};

export const checkValidArray = (arr) => {
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
  validRole,
  checkBirthDateFormat,
  validCWID,
  validGender,
};
