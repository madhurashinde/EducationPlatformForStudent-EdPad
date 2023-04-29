export const validStr = (str) => {
  if (!str) return false;
  if (typeof str !== "string") return false;
  if (str.trim() === "") return false;
  return true;
};

export const validWeblink = (str) => {
  if (!validStr(str)) return false;
  const web = /^www\..+\.com$/;
  if (!web.test(str.trim())) return false;
  return true;
};

export const nonNegInt = (str) => {
  if (!validStr(str)) return false;
  const num = parseInt(str);
  if (num === NaN || num < 0) return false;
  return true;
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

export const checkValidStr =(strVal) =>{
  //console.log(strVal)
    if (!strVal) throw `Error: You must supply a input!`;
    if (typeof strVal !== 'string') throw `Error: Input must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: Input cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: Input is not a valid value as it only contains digits`;
  return strVal
}
export const checkNameFormat =(strVal)=>{
console.log(strVal)
  if (!strVal) throw `Error: You must supply a input!`;
  if (typeof strVal !== 'string') throw `Error: Input must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: Input cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: Input is not a valid value as it only contains digits`;
  if(strVal.length < 2 || strVal.length >25)
      throw `Error: Input should be atleast 2 characters long with a max of 25 characters`
  return strVal;

}

export const checkEmailAddress = (strVal) =>{
  strVal = strVal.trim()
  if(!strVal.toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    throw `Error: Invalid format for email address`
  return strVal
}

const specialCharsWithoutNumbers = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
const checkSpaces = /\s/g;
const upperCase = /[A-Z]/g;
const numbers = /[0-9]/g;

export const validPassword = (strVal) => {
  if (!strVal) throw 'Password can not be empty';
  if (typeof strVal !== 'string') throw 'Password must be a string';
  strVal = strVal.trim()
  if (strVal.length === 0) throw 'Password cannot be an empty string or just spaces';
  if (strVal.length < 8) throw 'Password must contain atleast 8 characters';
  if(strVal.match(checkSpaces)) throw `Password can not contain any spaces`;
  if(!strVal.match(upperCase)) throw `Password must contain atleast one uppercase letter`;
  if(!strVal.match(numbers)) throw `Password must contain atleast one number`;
  if(!strVal.match(specialCharsWithoutNumbers)) throw `Password must contain atleast one special character`;
  return strVal;
}

export const validRole = (strVal) =>{
  if (!strVal) throw 'Role can not be empty';
  if (typeof strVal !== 'string') throw 'Role must be a string';
  strVal = strVal.trim();
  if (strVal.length === 0) throw 'Password cannot be an empty string or just spaces';
  if (!strVal.includes("student")){
      if(!strVal.includes("faculty")) throw `Error: Role can only be user or admin`
  } 
  return strVal;
  
}
export const checkNumberFormat = (num) =>{
if(typeof(num) !== "number"){
    throw `Error: The value is not of type number`
}
if(!(Number.isInteger(num))){
    throw  `Error: The year should be an integer`
}
if(num.toString().includes(".0")){
    throw `Error: The year should be an integer`
}
if(num <1900 || num >2023){
    throw `Error: The year can only be between 1900 to 2023`
}
return num;
}

export const checkBirthDateFormat =(strVal) =>{
if (!strVal) throw `Error: You must supply a string}!`;
  if (typeof strVal !== 'string') throw `Error: Each value must be a string!`;
  //console.log(strVal);
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: Input cannot be an empty string or string with just spaces`;

    const date = new Date();
    if(strVal.slice(2,3) !== "/" || strVal.slice(5,6) !== "/") throw `Date must be in the mm/dd/yyyy format`;

    let month = Number(strVal.slice(0,2));
    let day = Number(strVal.slice(3,5));
    let year = Number(strVal.slice(6));

    if(Number.isNaN(month) || Number.isNaN(day) || Number.isNaN(year)) throw `day, month and year must be numbers`;
    if(year > 2022) throw `Relese date must be within the current date`;
    // if(year < 1900) throw `Relese date can not be lower than 1900`;
    if(month < 1 || month > 12) throw `Month must be between 1-12`;
    if(day < 1 || day > 31) throw `Day must be between 1-31`;
    if(month=== 2 && day > 28) throw `February can not contain more than 28 days`;
    if(month === 4 || month === 6 || month === 9 || month === 11){
        if(day > 30) throw `Date can not be 31 for this month `;
    }
    return strVal;
}

export default{
checkValidStr,
checkNameFormat,
checkEmailAddress,
validPassword,
validRole,
checkBirthDateFormat,
checkNumberFormat

}