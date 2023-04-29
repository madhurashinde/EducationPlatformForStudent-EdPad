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

// const exportedMethods = {
//   checkId(id, varName) {
//     if (!id) throw `Error: You must provide a ${varName}`;
//     if (typeof id !== 'string') throw `Error:${varName} must be a string`;
//     id = id.trim();
//     if (id.length === 0)
//       throw `Error: ${varName} cannot be an empty string or just spaces`;
//     if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
//     return id;
//   },

//   checkString(strVal, varName) {
//     if (!strVal) throw `Error: You must supply a ${varName}!`;
//     if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
//     strVal = strVal.trim();
//     if (strVal.length === 0)
//       throw `Error: ${varName} cannot be an empty string or string with just spaces`;
//     if (!isNaN(strVal))
//       throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
//     return strVal;
//   },

//   checkStringArray(arr, varName) {
//     //We will allow an empty array for this,
//     //if it's not empty, we will make sure all tags are strings
//     if (!arr || !Array.isArray(arr))
//       throw `You must provide an array of ${varName}`;
//     for (let i in arr) {
//       if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
//         throw `One or more elements in ${varName} array is not a string or is an empty string`;
//       }
//       arr[i] = arr[i].trim();
//     }

//     return arr;
//   }
// };

// export default exportedMethods;
