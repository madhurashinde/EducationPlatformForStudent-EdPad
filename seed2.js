import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import {
  userFunc,
  assignmentFunc,
  submissionFunc,
  annsData,
  modulesData,
  coursesFunc,
} from "./data/index.js";

const db = await dbConnection();
await db.dropDatabase();

// create faculty
const major = ["Computer Science", "Business Analysis", "Chemistry"];
const gender = ["Male", "FEMALE", "prefer not to say"];

// create faculty
let faculty = [];
for (let i = 0; i < 5; i++) {
  const f = await userFunc.createUser(
    `Faculty${i}`,
    `Test${i}`,
    `faculty${i}@faculty${i}.com`,
    gender[i % 3],
    `0${i + 1}/2${i}/197${i}`,
    "Password123!",
    major[i % 3],
    "faculty"
  );
  faculty.push(f);
}

// create student
let student = [];
for (let i = 0; i < 5; i++) {
  student[i] = await userFunc.createUser(
    `Student${i}`,
    `Test${i}`,
    `student${i}@student${i}.com`,
    gender[i % 3],
    `0${i + 1}/2${i}/199${i}`,
    "Password123!",
    major[i % 3],
    "student"
  );
}

// create admin
const admin1 = await userFunc.createUser(
  "Enrique",
  "Dunn",
  "admin1@admin1.com",
  "male",
  "05/05/1990",
  "Password123!",
  "Computer Science",
  "admin"
);

//create course
let course = [];
for (let i = 0; i < 6; i++) {
  const c = await coursesFunc.createCourse(
    `Introduction to JavaScript${i + 1}`,
    `JS10${i}`,
    "Learn the basics of JavaScript programming language",
    faculty[i % 5]._id
  );
  course.push(c);
}

// create announcement
for (let i = 0; i < 7; i++) {
  await annsData.create(
    `Announcement ${parseInt(i / 6) + 1}`,
    `This is announcement ${parseInt(i / 6) + 1}`,
    course[i % 6]._id
  );
}

// create modules
for (let i = 0; i < 7; i++) {
  await modulesData.create(
    `Material ${parseInt(i / 6) + 1}`,
    `This is material ${parseInt(i / 6) + 1}`,
    `www.module${parseInt(i / 6) + 1}.com`,
    course[i % 6]._id
  );
}

// create assignment
let assignment = [];
for (let i = 0; i < 10; i++) {
  const a = await assignmentFunc.createAssignment(
    `Assignment ${parseInt(i / 6) + 1}`,
    course[i % 5]._id,
    `2023-05-1${i}`,
    "00:00:00",
    "please read the instruction",
    "www.file.com",
    Number(`${50 + i * 10}`).toString()
  );
  assignment.push(a);
}

//student register for courses
await coursesFunc.registerCourse(student[0]._id, course[0]._id);
await coursesFunc.registerCourse(student[0]._id, course[1]._id);
await coursesFunc.registerCourse(student[0]._id, course[2]._id);
await coursesFunc.registerCourse(student[1]._id, course[3]._id);
await coursesFunc.registerCourse(student[1]._id, course[4]._id);
await coursesFunc.registerCourse(student[1]._id, course[5]._id);
await coursesFunc.registerCourse(student[2]._id, course[0]._id);
await coursesFunc.registerCourse(student[2]._id, course[1]._id);
await coursesFunc.registerCourse(student[3]._id, course[2]._id);
await coursesFunc.registerCourse(student[3]._id, course[3]._id);
await coursesFunc.registerCourse(student[4]._id, course[4]._id);
await coursesFunc.registerCourse(student[4]._id, course[5]._id);

// create submission
for (let i = 0; i < 6; i++)
  await submissionFunc.createSubmission(
    assignment[i]._id,
    student[i % 5]._id,
    `www.submission${i % 5}.com`
  );

await closeConnection();
