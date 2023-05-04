import studFunc from "./data/students.js";
import { facultyFunc, adminFunc } from "./data/index.js";

// console.log(
//   await studFunc.createStudent(
//     "John",
//     "Doe",
//     "123456",
//     "johndoe@example.com",
//     "Male",
//     "05/20/1998",
//     "Password123!",
//     "Computer Science",
//     ["JS101", "HTML101"],
//     ["JS101"],
//     "student"
//   )
// );

console.log(
  await studFunc.checkStudent("madhura.shinde@stevens.edu", "Wefindyoucute123!")
);

// console.log(
//   await facultyFunc.createFaculty(
//     "Patrick",
//     "Hill",
//     "20011456",
//     "patrick.hill@stevens.edu",
//     "Male",
//     "02/07/1976",
//     "TestingPass123@",
//     "Computer Science",
//     ["CS546", "CS554"],
//     ["CS554"],
//     "faculty"
//   )
// );

console.log(
  await facultyFunc.checkFaculty("patrick.hill@stevens.edu", "TestingPass123@")
);

// console.log(
//   await adminFunc.createAdmin(
//     "Janine",
//     "Cucchiara",
//     "22301836",
//     "Jannine.cucchiara@stevens.edu",
//     "Letsnotbeanadmin@123",
//     "Business Analytics",
//     "admin"
//   )
// );

console.log(
  await adminFunc.checkAdmin(
    "jannine.cucchiara@stevens.edu",
    "Letsnotbeanadmin@123"
  )
);
