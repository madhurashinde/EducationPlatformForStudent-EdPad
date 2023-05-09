import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import {
  userFunc,
  adminFunc,
  assignmentFunc,
  submissionFunc,
  annsData,
  modulesData,
  coursesFunc,
  gradeFunc,
} from "./data/index.js";

const db = await dbConnection();
await db.dropDatabase();

// initialze registration status
await adminFunc.initRegistrationStatus();
await adminFunc.changeStatus();

// create major
const major = ["Computer Science", "Business Analysis", "Chemistry"];
for (let i = 0; i < major.length; i++) {
  await adminFunc.addMajor(major[i]);
}
// create faculty

const gender = ["Male", "FEMALE", "prefer not to say"];

// create faculty
const facultynames = [
  ["Emily", "Johnson"],
  ["Oliver", "Brown"],
  ["Sophia", "Lee"],
  ["William", "Garcia"],
  ["Charlotte", "Taylor"],
];

const facultyEmailAddresses = facultynames.map(
  (name) => `${name[0].toLowerCase()}@${name[1].toLowerCase()}.com`
);

let faculty = [];
for (let i = 0; i < 5; i++) {
  const f = await userFunc.createUser(
    facultynames[i][0],
    facultynames[i][1],
    facultyEmailAddresses[i],
    gender[i % 3],
    `197${i}-0${i + 1}-2${i}`,
    "Password123!",
    major[i % 3],
    "faculty"
  );
  faculty.push(f);
}

// create student
const studentnames = [
  ["Michael", "Davis"],
  ["Isabella", "Anderson"],
  ["Ethan", "Wilson"],
  ["Ava", "Smith"],
  ["Alexander", "Jones"],
];

const studentEmailAddresses = studentnames.map(
  (name) => `${name[0].toLowerCase()}@${name[1].toLowerCase()}.com`
);
let student = [];
for (let i = 0; i < 5; i++) {
  student[i] = await userFunc.createUser(
    studentnames[i][0],
    studentnames[i][1],
    studentEmailAddresses[i],
    gender[i % 3],
    `199${i}-0${i + 1}-2${i}`,
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
  "1990-05-05",
  "Password123!",
  "Computer Science",
  "admin"
);

//create current course
const courseName = [
  "Web Porgramming 2",
  "Data Structures and Algorithms",
  "Operating Systems",
  "Computer Networks",
  "Database Systems",
  "Web Porgramming",
];
const courseDescription = [
  "Introduction to web technologies, HTML, CSS, JavaScript, server-side programming, database integration, web frameworks, and web security.",
  "This course covers advanced data structures and algorithms for problem-solving and analysis, including topics such as recursion, sorting and searching, graph algorithms, and dynamic programming.",
  "This course covers the design and implementation of operating systems, including topics such as process and memory management, file systems, and device drivers.",
  "This course covers the principles and technologies of computer networking, including topics such as network protocols, routing, congestion control, and network security.",
  "This course covers the design, implementation, and management of database systems, including topics such as data modeling, SQL programming, transaction management, and database security.",
  "Introduction to web technologies, HTML, CSS, JavaScript, server-side programming, database integration, web frameworks, and web security.",
];
let course = [];
for (let i = 0; i < 6; i++) {
  const c = await coursesFunc.createCourse(
    courseName[i],
    `CS50${i}`,
    courseDescription[i],
    faculty[i % 5]._id
  );
  course.push(c);
}

// create announcement
//course5 has no announcement
for (let i = 0; i < 5; i++) {
  await annsData.create(
    `Announcement ${parseInt(i / 6) + 1}`,
    `This is announcement ${parseInt(i / 6) + 1}`,
    course[i % 6]._id
  );
}

for (let i = 6; i < 9; i++) {
  await annsData.create(
    `Announcement ${parseInt(i / 6) + 1}`,
    `This is announcement ${parseInt(i / 6) + 1}`,
    course[i % 6]._id
  );
}

for (let i = 12; i < 13; i++) {
  await annsData.create(
    `Announcement ${parseInt(i / 6) + 1}`,
    `This is announcement ${parseInt(i / 6) + 1}`,
    course[i % 6]._id
  );
}

// create modules
for (let i = 0; i < 5; i++) {
  await modulesData.create(
    `Material ${parseInt(i / 6) + 1}`,
    `This is material ${parseInt(i / 6) + 1}`,
    `module${i + 1}.txt`,
    course[i % 6]._id
  );
}

for (let i = 6; i < 9; i++) {
  await modulesData.create(
    `Material ${parseInt(i / 6) + 1}`,
    `This is material ${parseInt(i / 6) + 1}`,
    `module${i}.txt`,
    course[i % 6]._id
  );
}

for (let i = 12; i < 13; i++) {
  await modulesData.create(
    `Material ${parseInt(i / 6) + 1}`,
    `This is material ${parseInt(i / 6) + 1}`,
    `module${i - 2}.txt`,
    course[i % 6]._id
  );
}

// create assignment
let assignment = [];
for (let i = 0; i < 5; i++) {
  const a = await assignmentFunc.createAssignment(
    `Assignment ${parseInt(i / 5) + 1}`,
    course[i % 5]._id,
    `2023-05-1${i}`,
    "00:00:00",
    "please read the instruction",
    `assignmentsample${i + 1}.txt`,
    Number(`${50 + i * 10}`).toString()
  );
  assignment.push(a);
}

for (let i = 6; i < 9; i++) {
  const a = await assignmentFunc.createAssignment(
    `Assignment ${parseInt(i / 5) + 1}`,
    course[i % 5]._id,
    `2023-05-2${i}`,
    "00:00:00",
    "please read the instruction",
    `assignmentsample${i + 1}.txt`,
    Number(`${i * 10}`).toString()
  );
  assignment.push(a);
}

// no attachment
for (let i = 12; i < 13; i++) {
  const a = await assignmentFunc.createAssignment(
    `Assignment ${parseInt(i / 5) + 1}`,
    course[i % 5]._id,
    `2023-05-${i}`,
    "00:00:00",
    "please list all you hobbies",
    "",
    Number(`${i * 10}`).toString()
  );
  assignment.push(a);
}

//student register for courses (past course)
await coursesFunc.registerCourse(student[0]._id, course[0]._id);
await coursesFunc.registerCourse(student[0]._id, course[1]._id);
await coursesFunc.registerCourse(student[1]._id, course[0]._id);
await coursesFunc.registerCourse(student[2]._id, course[0]._id);
await coursesFunc.registerCourse(student[2]._id, course[1]._id);
await coursesFunc.registerCourse(student[2]._id, course[2]._id);
await coursesFunc.registerCourse(student[3]._id, course[3]._id);
await coursesFunc.registerCourse(student[3]._id, course[4]._id);
await coursesFunc.registerCourse(student[3]._id, course[5]._id);

// start a new semester
await adminFunc.archive();

// student register for courses (current course)
// student0 cannot register more courses
// student3 has registered no course
// student4 is a new student
await coursesFunc.registerCourse(student[0]._id, course[2]._id);
await coursesFunc.registerCourse(student[0]._id, course[3]._id);
await coursesFunc.registerCourse(student[0]._id, course[4]._id);
await coursesFunc.registerCourse(student[0]._id, course[5]._id);
await coursesFunc.registerCourse(student[1]._id, course[1]._id);
// await coursesFunc.registerCourse(student[1]._id, course[2]._id);
// await coursesFunc.registerCourse(student[1]._id, course[3]._id);
// await coursesFunc.registerCourse(student[1]._id, course[4]._id);
// await coursesFunc.registerCourse(student[1]._id, course[5]._id);
// await coursesFunc.registerCourse(student[2]._id, course[3]._id);
await coursesFunc.registerCourse(student[2]._id, course[4]._id);
await coursesFunc.registerCourse(student[2]._id, course[5]._id);
// await coursesFunc.registerCourse(student[3]._id, course[0]._id);
// await coursesFunc.registerCourse(student[3]._id, course[1]._id);
// await coursesFunc.registerCourse(student[3]._id, course[2]._id);
await coursesFunc.registerCourse(student[4]._id, course[0]._id);
await coursesFunc.registerCourse(student[4]._id, course[1]._id);
// await coursesFunc.registerCourse(student[4]._id, course[2]._id);
// await coursesFunc.registerCourse(student[4]._id, course[3]._id);
// await coursesFunc.registerCourse(student[4]._id, course[4]._id);
// await coursesFunc.registerCourse(student[4]._id, course[5]._id);

// create submission
const submission = [];
let sub = await submissionFunc.createSubmission(
  assignment[2]._id,
  student[0]._id,
  `submission1.txt`
);
submission.push(sub);

sub = await submissionFunc.createSubmission(
  assignment[6]._id,
  student[0]._id,
  `submission2.txt`
);
submission.push(sub);

sub = await submissionFunc.createSubmission(
  assignment[1]._id,
  student[1]._id,
  `submission3.txt`
);
submission.push(sub);

sub = await submissionFunc.createSubmission(
  assignment[4]._id,
  student[2]._id,
  `submission4.txt`
);
submission.push(sub);

sub = await submissionFunc.createSubmission(
  assignment[0]._id,
  student[4]._id,
  `submission5.txt`
);
submission.push(sub);

sub = await submissionFunc.createSubmission(
  assignment[5]._id,
  student[4]._id,
  `submission6.txt`
);
submission.push(sub);

sub = await submissionFunc.createSubmission(
  assignment[1]._id,
  student[4]._id,
  `submission7.txt`
);
submission.push(sub);

//grade assignment
for (let i = 0; i < submission.length - 1; i++) {
  await gradeFunc.grade(submission[i]._id.toString(), "10");
}

await closeConnection();
