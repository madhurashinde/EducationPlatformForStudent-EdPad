import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import {
  studFunc,
  facultyFunc,
  adminFunc,
  assignmentFunc,
  submissionFunc,
  coursesFunc,
} from "./data/index.js";

const db = await dbConnection();
await db.dropDatabase();

const faculty1 = await facultyFunc.createFaculty(
  "Lori",
  "Test",
  "66666666",
  "test@test.com",
  "female",
  "02/29/1976",
  "Password123*",
  "Computer Science",
  ["CS546"],
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
  "12345678",
  "johndoe@example.com",
  "Male",
  "05/20/1998",
  "Password123!",
  "Computer Science",
  ["JS101", "CS554"],
  ["JS101"],
  "student"
);

const student2 = await studFunc.createStudent(
  "Madhura",
  "Shinde",
  "20114380",
  "madhura.shinde@stevens.edu",
  "Female",
  "04/23/1998",
  "Wefindyoucute123!",
  "Computer Science",
  ["CS513", "CS570", "CS555"],
  ["CS546", "CS573", "CS513"],
  "student"
);

const student3 = await studFunc.createStudent(
  "Rishabh",
  "Shirur",
  "20113450",
  "rishabh.shirur@stevens.edu",
  "Male",
  "05/31/2000",
  "Thisisnotthepassword123!",
  "Computer Science",
  ["CS583", "CS590", "CS559"],
  ["CS546", "CS561", "CS586"],
  "student"
);

const student4 = await studFunc.createStudent(
  "Jiaqi",
  "Tu",
  "20012340",
  "jiaqi.tu@stevens.edu",
  "Male",
  "05/13/2000",
  "Keptthrowinganerror123!",
  "Computer Science",
  ["CS583", "CS590", "CS559"],
  ["CS546", "CS561", "CS586"],
  "student"
);

const student5 = await studFunc.createStudent(
  "Luoyi",
  "Fu",
  "20143210",
  "luoyi.fu@stevens.edu",
  "Female",
  "11/09/2001",
  "Testingeverything!123",
  "Computer Science",
  ["CS583", "CS590", "CS559"],
  [],
  "student"
);

const admin1 = await adminFunc.createAdmin(
  "Enrique",
  "Dunn",
  "10202020",
  "enriqye.dunn@stevens.edu",
  "Iamtheadmin@123",
  "Computer Science",
  "admin"
);
const admin2 = await adminFunc.createAdmin(
  "Janine",
  "Cucchiara",
  "22301836",
  "jannine.cucchiara@stevens.edu",
  "Letsnotbeanadmin@123",
  "Business Analytics",
  "admin"
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
  student1._id.toString(),
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
  student1._id.toString(),
  "www.submission2.com"
);

const submission3 = await submissionFunc.createSubmission(
  assignment3._id.toString(),
  "643895a8b3ee41b54432b774",
  "www.submission2.com",
  "this is a comment"
);

let newCourse = await coursesFunc.createCourse(
  "Introduction to JavaScript3",
  "JS101",
  "Learn the basics of JavaScript programming language",
  "PROF001",
  "John Smith"
);

let newCourse2 = await coursesFunc.createCourse(
  "Introduction to JavaScript3",
  "CS554",
  "Learn the basics of JavaScript programming language",
  "PROF001",
  "John Smith"
);

let newCourse3 = await coursesFunc.createCourse(
  "Introduction to JavaScript3",
  "CS573",
  "Learn the basics of JavaScript programming language",
  "PROF001",
  "John Smith"
);
await closeConnection();
