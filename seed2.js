import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import {
  studFunc,
  facultyFunc,
  adminFunc,
  assignmentFunc,
  submissionFunc,
  annsData,
  modulesData,
  coursesFunc,
} from "./data/index.js";

const db = await dbConnection();
await db.dropDatabase();

// create faculty
const faculty1 = await facultyFunc.createFaculty(
  "Lori",
  "Test",
  "66666666",
  "faculty1@faculty1.com",
  "female",
  "02/29/1976",
  "Password123!",
  "Computer Science"
);

const faculty2 = await facultyFunc.createFaculty(
  "Patrick",
  "Hill",
  "20011456",
  "faculty2@faculty2.com",
  "Male",
  "02/07/1976",
  "Password123!",
  "Computer Science"
);

const faculty3 = await facultyFunc.createFaculty(
  "Samuel",
  "Kim",
  "20193735",
  "faculty3@faculty3.com",
  "Male",
  "02/27/1980",
  "Password123!",
  "Computer Science"
);

const faculty4 = await facultyFunc.createFaculty(
  "Edward",
  "Amoroso",
  "20193745",
  "faculty4@faculty4.com",
  "Male",
  "10/17/1964",
  "Password123!",
  "Computer Science"
);

const faculty5 = await facultyFunc.createFaculty(
  "Michael",
  "Greenberg",
  "20022002",
  "faculty5@faculty5.com",
  "Male",
  "06/20/1973",
  "Password123!",
  "Computer Science"
);

// create student
const student1 = await studFunc.createStudent(
  "John",
  "Doe",
  "12345678",
  "student1@student1.com",
  "Male",
  "05/20/1998",
  "Password123!",
  "Computer Science"
);

const student2 = await studFunc.createStudent(
  "Madhura",
  "Shinde",
  "20114380",
  "student2@student2.com",
  "Female",
  "04/23/1998",
  "Password123!",
  "Computer Science"
);

const student3 = await studFunc.createStudent(
  "Rishabh",
  "Shirur",
  "20113450",
  "student3@student3.com",
  "Male",
  "05/31/2000",
  "Password123!",
  "Computer Science"
);

const student4 = await studFunc.createStudent(
  "Jiaqi",
  "Tu",
  "20012340",
  "student4@student4.com",
  "Male",
  "05/13/2000",
  "Password123!",
  "Computer Science"
);

const student5 = await studFunc.createStudent(
  "Luoyi",
  "Fu",
  "20143210",
  "student5@student5.com",
  "Female",
  "11/09/2001",
  "Password123!",
  "Computer Science"
);

// create admin
const admin1 = await adminFunc.createAdmin(
  "Enrique",
  "Dunn",
  "10202020",
  "admin1@admin1.com",
  "Password123!",
  "Computer Science"
);
const admin2 = await adminFunc.createAdmin(
  "Janine",
  "Cucchiara",
  "22301836",
  "admin2@admin2.com",
  "Password123!",
  "Business Analytics"
);

//create course
const course1 = await coursesFunc.createCourse(
  "Introduction to JavaScript3",
  "JS101",
  "Learn the basics of JavaScript programming language",
  "PROF001",
  "John Smith"
);

const course2 = await coursesFunc.createCourse(
  "Introduction to JavaScript3",
  "CS554",
  "Learn the basics of JavaScript programming language",
  "PROF001",
  "John Smith"
);

const course3 = await coursesFunc.createCourse(
  "Introduction to JavaScript3",
  "CS573",
  "Learn the basics of JavaScript programming language",
  "PROF001",
  "John Smith"
);

// create announcement
await annsData.create("Announcement 1", "This is announcement 1", course1._id);

await annsData.create("Announcement 2", "This is announcement 2", course1._id);

await annsData.create("Announcement 1", "This is an announcement", course2._id);

await annsData.create("Announcement 1", "This is an announcement", course3._id);

// create modules
await modulesData.create(
  "Material 1",
  "This is material 1",
  "www.module1.com",
  course1._id
);

await modulesData.create(
  "Material 2",
  "This is material 2",
  "www.module2.com",
  course1._id
);

await modulesData.create(
  "Material 1",
  "This is material 1",
  "www.module1.com",
  course2._id
);

await modulesData.create(
  "Material 1",
  "This is material 1",
  "www.module1.com",
  course3._id
);

// create assignment
const assignment1 = await assignmentFunc.createAssignment(
  "Assignment 1",
  course1._id,
  "2023-05-10",
  "00:00:00",
  "please read the instruction",
  "www.file.com",
  "50"
);

const assignment2 = await assignmentFunc.createAssignment(
  "Assignment 2",
  course1._id,
  "2023-06-01",
  "00:00:00",
  "please read the instruction",
  "www.file2.com",
  "50"
);

const assignment3 = await assignmentFunc.createAssignment(
  "Assignment 3",
  course1._id,
  "2023-07-01",
  "00:00:00",
  "this is instruction",
  "www.file2.com",
  "50"
);

const assignment4 = await assignmentFunc.createAssignment(
  "Assignment 1",
  course2._id,
  "2023-05-10",
  "00:00:00",
  "please read the instruction",
  "www.file.com",
  "50"
);

const assignment5 = await assignmentFunc.createAssignment(
  "Assignment 2",
  course2._id,
  "2023-06-01",
  "00:00:00",
  "please read the instruction",
  "www.file2.com",
  "50"
);

const assignment6 = await assignmentFunc.createAssignment(
  "Assignment 3",
  course2._id,
  "2023-07-01",
  "00:00:00",
  "this is instruction",
  "www.file2.com",
  "50"
);

const assignment7 = await assignmentFunc.createAssignment(
  "Assignment 1",
  course3._id,
  "2023-05-10",
  "00:00:00",
  "please read the instruction",
  "www.file.com",
  "50"
);

const assignment8 = await assignmentFunc.createAssignment(
  "Assignment 2",
  course3._id,
  "2023-06-01",
  "00:00:00",
  "please read the instruction",
  "www.file2.com",
  "50"
);

const assignment9 = await assignmentFunc.createAssignment(
  "Assignment 3",
  course3._id,
  "2023-07-01",
  "00:00:00",
  "this is instruction",
  "www.file2.com",
  "50"
);

//student register for courses
await coursesFunc.registerCourse(student1._id, course1._id);
await coursesFunc.registerCourse(student1._id, course2._id);
await coursesFunc.registerCourse(student1._id, course3._id);
await coursesFunc.registerCourse(student2._id, course1._id);
await coursesFunc.registerCourse(student2._id, course2._id);
await coursesFunc.registerCourse(student3._id, course1._id);
await coursesFunc.registerCourse(student3._id, course3._id);
await coursesFunc.registerCourse(student4._id, course2._id);
await coursesFunc.registerCourse(student4._id, course3._id);

// create submission
await submissionFunc.createSubmission(
  assignment1._id,
  student1._id,
  "www.submission.com"
);

await submissionFunc.createSubmission(
  assignment2._id.toString(),
  student1._id.toString(),
  "www.submission2.com",
  "this is a comment"
);

await submissionFunc.createSubmission(
  assignment3._id.toString(),
  student2._id,
  "www.submission2.com",
  "this is a comment"
);

await submissionFunc.createSubmission(
  assignment8._id.toString(),
  student3._id,
  "www.submission2.com",
  "this is a comment"
);

await submissionFunc.createSubmission(
  assignment9._id.toString(),
  student4._id,
  "www.submission2.com",
  "this is a comment"
);

await closeConnection();
