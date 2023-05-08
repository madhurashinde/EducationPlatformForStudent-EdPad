// import studFunc from "./data/students.js";
// import { facultyFunc, adminFunc } from "./data/index.js";

// // console.log(
// //   await studFunc.createStudent(
// //     "John",
// //     "Doe",
// //     "123456",
// //     "johndoe@example.com",
// //     "Male",
// //     "05/20/1998",
// //     "Password123!",
// //     "Computer Science",
// //     ["JS101", "HTML101"],
// //     ["JS101"],
// //     "student"
// //   )
// // );

// console.log(
//   await studFunc.checkStudent("madhura.shinde@stevens.edu", "Wefindyoucute123!")
// );

// // console.log(
// //   await facultyFunc.createFaculty(
// //     "Patrick",
// //     "Hill",
// //     "20011456",
// //     "patrick.hill@stevens.edu",
// //     "Male",
// //     "02/07/1976",
// //     "TestingPass123@",
// //     "Computer Science",
// //     ["CS546", "CS554"],
// //     ["CS554"],
// //     "faculty"
// //   )
// // );

// console.log(
//   await facultyFunc.checkFaculty("patrick.hill@stevens.edu", "TestingPass123@")
// );

// // console.log(
// //   await adminFunc.createAdmin(
// //     "Janine",
// //     "Cucchiara",
// //     "22301836",
// //     "Jannine.cucchiara@stevens.edu",
// //     "Letsnotbeanadmin@123",
// //     "Business Analytics",
// //     "admin"
// //   )
// // );

// console.log(
//   await adminFunc.checkAdmin(
//     "jannine.cucchiara@stevens.edu",
//     "Letsnotbeanadmin@123"
//   )
// );

// console.log(new Date().toLocaleDateString());
// console.log(new Date());
// for (let i = 0; i < 10; i++) {
//   console.log(i % 3);
// }

// export const validStr = (str) => {
//   if (!str) throw new TypeError(`Error: You must supply an input!`);
//   if (typeof str !== "string")
//     throw new TypeError("Error: input must be a string!");
//   str = str.trim();
//   if (str === "")
//     throw new TypeError(
//       "Error: input cannot be an empty string or string with just spaces"
//     );
//   return str;
// };
// try {
//   validStr("");
// } catch (e) {
//   if (e instanceof TypeError) {
//     console.log("type error 400" + e.message);
//   } else {
//     console.log("500");
//   }
// }

import { adminFunc } from "./data/index.js";
console.log(await adminFunc.getAllMajors());
