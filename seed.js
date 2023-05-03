import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { assignmentFunc, submissionFunc, studFunc } from "./data/index.js";

const db = await dbConnection();
await db.dropDatabase();

const student1 = await studFunc.createStudent(
  "John",
  "Doe",
  "123456",
  "johndoe@example.com",
  "Male",
  "1998-05-20",
  "password123",
  "Computer Science",
  ["JS101", "HTML101"],
  ["JS101"],
  "student"

);



const assignment1 = await assignmentFunc.createAssignment(
  "Assignment 1",
  "643895a8b3ee41b54432b77b",
  "2023-05-01",
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

console.log(await assignmentFunc.getAllAssignment("643895a8b3ee41b54432b77b"));
console.log("---------------------");
console.log(await assignmentFunc.removeAssignment(assignment1._id.toString()));
console.log("---------------------");
console.log(await assignmentFunc.getAllAssignment("643895a8b3ee41b54432b77b"));

console.log("update");
console.log(
  await assignmentFunc.updateAssignment(
    assignment2._id.toString(),
    "Assignment 2",
    "2023-06-02",
    "00:00:00",
    "please read the instruction",
    "www.google.com",
    "50"
  )
);
console.log("---------------------");
console.log(await assignmentFunc.getAllAssignment("643895a8b3ee41b54432b77b"));

const submission1 = await submissionFunc.createSubmission(
  assignment2._id.toString(),
  "643895a8b3ee41b54432b773",
  "www.submission.com"
);

console.log(submission1);

const submission2 = await submissionFunc.createSubmission(
  assignment2._id.toString(),
  "643895a8b3ee41b54432b774",
  "www.submission2.com",
  "this is a comment"
);
console.log(submission2);

console.log(
  await submissionFunc.getSubmission(
    assignment2._id.toString(),
    "643895a8b3ee41b54432b773"
  )
);
console.log("---------------------");
console.log(await submissionFunc.getAllSubmission(assignment2._id.toString()));
console.log("---------------------");
console.log(
  await submissionFunc.resubmitSubmission(
    assignment2._id.toString(),
    "643895a8b3ee41b54432b774",
    "www.submission2.com"
  )
);

const submission3 = await submissionFunc.createSubmission(
  assignment3._id.toString(),
  "643895a8b3ee41b54432b774",
  "www.submission2.com",
  "this is a comment"
);
console.log(submission3);

await closeConnection();
