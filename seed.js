import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import {
  studFunc,
  facultyFunc,
  adminFunc,
  assignmentFunc,
  submissionFunc,
  coursesFunc
} from "./data/index.js";

const db = await dbConnection();
await db.dropDatabase();

let courseTitle = "Introduction to JavaScript3";
let courseId = "JS101";
let description = "Learn the basics of JavaScript programming language";
let professorId = "PROF001";
let professorName = "John Smith";

try {
  let newCourse = await coursesFunc.createCourse(
    "Introduction to JavaScript3",
    courseId,
    "Learn the basics of JavaScript programming language",
    professorId,
    professorName
  );
  // console.log(newCourse);
} catch (e) {
  console.log(e);
}
// console.log(newCourse);




const faculty1 = await facultyFunc.createFaculty(
  "Lori",
  "Test",
  "666666",
  "test@test.com",
  "female",
  "02/29/1976",
  "Password123*",
  "Computer Science",
  ["CS546", "CS123"],
  ["CS554"],
  "faculty"
);

const faculty2 = await facultyFunc.createFaculty(
  "Patrick",
  "Hill",
  "20011456",
  "patrick.hill@stevens.edu",
  "Male",
  "02/07/1976",
  "TestingPass123@",
  "Computer Science",
  ["CS546", "CS554"],
  ["CS554"],
  "faculty"
);

const faculty3 = await facultyFunc.createFaculty(
  "Samuel",
  "Kim",
  "20193735",
  "samuel.kim@stevens.edu",
  "Male",
  "02/27/1980",
  "ManagePass123@",
  "Computer Science",
  ["CS541", "CS 102"],
  ["CS541"],
  "faculty"
);

const faculty4 = await facultyFunc.createFaculty(
  "Edward",
  "Amoroso",
  "20193745",
  "edward.amoroso@stevens.edu",
  "Male",
  "10/17/1964",
  "GivethePass@123",
  "Computer Science",
  ["CS573"],
  ["CS573"],
  "faculty"
);

const faculty5 = await facultyFunc.createFaculty(
  "Michael",
  "Greenberg",
  "20022002",
  "michael.greenberg@stevens.edu",
  "Male",
  "06/20/1973",
  "LetsPartyTonight@123",
  "Computer Science",
  ["CS515"],
  ["CS515"],
  "faculty"
);
const student1 = await studFunc.createStudent(
  "John",
  "Doe",
  "123456",
  "johndoe@example.com",
  "Male",
  "05/20/1998",
  "Password123!",
  "Computer Science",
  ["JS101", "HTML101"],
  ["JS101"],
  "student"
);

const assignment1 = await assignmentFunc.createAssignment(
  "Assignment 1",
  "643895a8b3ee41b54432b77b",
  "2023-05-10",
  "00:00:00",
  "please read the instruction",
  "www.file.com",
  "50"
);

const assignment2 = await assignmentFunc.createAssignment(
  "Assignment 2",
  "643895a8b3ee41b54432b77b",
  "2023-06-01",
  "00:00:00",
  "please read the instruction",
  "www.file2.com",
  "50"
);

const assignment3 = await assignmentFunc.createAssignment(
  "Assignment 3",
  "643895a8b3ee41b54432b77b",
  "2023-07-01",
  "00:00:00",
  "this is instruction",
  "www.file2.com",
  "50"
);

await assignmentFunc.getAllAssignment("643895a8b3ee41b54432b77b");
await assignmentFunc.removeAssignment(assignment1._id.toString());
await assignmentFunc.getAllAssignment("643895a8b3ee41b54432b77b");
await assignmentFunc.updateAssignment(
  assignment2._id.toString(),
  "Assignment 2",
  "2023-06-02",
  "00:00:00",
  "please read the instruction",
  "www.google.com",
  "50"
);
await assignmentFunc.getAllAssignment("643895a8b3ee41b54432b77b");

const submission1 = await submissionFunc.createSubmission(
  assignment2._id.toString(),
  "643895a8b3ee41b54432b773",
  "www.submission.com"
);

const submission2 = await submissionFunc.createSubmission(
  assignment2._id.toString(),
  "643895a8b3ee41b54432b774",
  "www.submission2.com",
  "this is a comment"
);

await submissionFunc.getSubmission(
  assignment2._id.toString(),
  "643895a8b3ee41b54432b773"
);

await submissionFunc.getAllSubmission(assignment2._id.toString());

await submissionFunc.resubmitSubmission(
  assignment2._id.toString(),
  "643895a8b3ee41b54432b774",
  "www.submission2.com"
);

const submission3 = await submissionFunc.createSubmission(
  assignment3._id.toString(),
  "643895a8b3ee41b54432b774",
  "www.submission2.com",
  "this is a comment"
);

await closeConnection();
