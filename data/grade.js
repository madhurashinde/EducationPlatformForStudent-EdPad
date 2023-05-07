import { assignment, course, user } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, nonNegInt } from "../helper.js";

const grade = async (submissionId, grade) => {
  submissionId = validId(submissionId);
  grade = nonNegInt(grade);
  const assignmentDetail = await assignment();
  const newSubmissionId = new ObjectId(submissionId);
  const submissionDetail = await assignmentDetail.findOne(
    {
      "submission._id": newSubmissionId,
    },
    { projection: { score: 1, "submission.$": 1 } }
  );
  if (grade > submissionDetail.score) throw "grade cannot exceed total score";

  const updateSubmission = await assignmentDetail.updateOne(
    { "submission._id": newSubmissionId },
    { $set: { "submission.$.scoreGet": grade } }
  );
  if (!updateSubmission.acknowledged) throw "Cannot grade successfully";

  return "Successfully graded";
};

const getCourseGrade = async (courseId) => {
  courseId = validId(courseId);

  // get student list
  const courseCollection = await course();
  const studentList = await courseCollection
    .find({ _id: new ObjectId(courseId) }, { projection: { studentlist: 1 } })
    .toArray();
  if (!studentList) throw "Could not get student list";
  if (studentList.length === 0) return null;
  const students = studentList[0].studentlist;

  //get students' names
  const userCollection = await user();
  let studentName = [];
  for (let i = 0; i < students.length; i++) {
    const studInfo = await userCollection.findOne({
      _id: new ObjectId(students[i]),
    });
    studentName.push(studInfo.firstName + " " + studInfo.lastName);
  }

  // get all assignments
  const assignmentCollection = await assignment();
  const assignmentList = await assignmentCollection
    .find(
      { courseId: new ObjectId(courseId) },
      {
        projection: {
          _id: 1,
          title: 1,
          score: 1,
          "submission.studentId": 1,
          "submission.scoreGet": 1,
        },
      }
    )
    .toArray();
  if (!assignmentList) throw "Could not get assignment list";

  const assignments = [];
  for (let i = 0; i < assignmentList.length; i++) {
    assignments.push([
      assignmentList[i]._id.toString(),
      assignmentList[i].title,
      assignmentList[i].score,
    ]);
  }

  // get each student's grade for each assignment

  let grades = {};
  let res = {};
  for (let i = 0; i < students.length; i++) {
    for (let j = 0; j < assignments.length; j++) {
      const hisAssignment = await assignmentCollection.findOne(
        {
          $and: [
            {
              _id: new ObjectId(assignments[j][0]),
            },
            { "submission.studentId": new ObjectId(students[i]) },
          ],
        },
        {
          projection: {
            "submission.scoreGet.$": 1,
          },
        }
      );
      // assignment Id, title, total score, his score
      if (hisAssignment === null) {
        grades[assignments[j][0]] = [
          studentName[i],
          assignments[j][1],
          assignments[j][2],
          "not yet submitted",
        ];
      } else if (hisAssignment.submission[0].scoreGet === null) {
        grades[assignments[j][0]] = [
          studentName[i],
          assignments[j][1],
          assignments[j][2],
          "not yet graded",
        ];
      } else {
        grades[assignments[j][0]] = [
          studentName[i],
          assignments[j][1],
          assignments[j][2],
          hisAssignment.submission[0].scoreGet,
        ];
      }
      res[students[i]] = grades;
    }
  }
  return res;
};

const getClassScore = async (courseId) => {
  courseId = validId(courseId);
  const allGrade = await getCourseGrade(courseId);
  const students = Object.keys(allGrade);
  let res = {};
  for (let i = 0; i < students.length; i++) {
    let total = 0;
    let get = 0;
    const allscore = allGrade[students[i]];
    for (let j = 0; j < allscore.length; j++) {
      if (typeof allscore[j][2] === "string") {
        total += allscore[j][1];
        get += allscore[j][2];
      }
    }
    const keys = Object.keys(allGrade[students[i]]);
    if (total === 0) {
      res[students[i]] = [0, allGrade[students[i]][keys[0]][0]];
    } else {
      res[students[i]] = [
        Math.round((get / total) * 10000) / 100,
        allGrade[students[i][0]],
      ];
    }
  }
  return res;
};

const getStudentScore = async (courseId, studentId) => {
  courseId = validId(courseId);
  studentId = validId(studentId);
  const allGrade = await getCourseGrade(courseId);
  const thisGrade = allGrade[studentId];
  return thisGrade;
};
export default { grade, getClassScore, getStudentScore };

// console.log(await getCourseGrade("64558c7e1f1b16f3b1cbefe3"));
// console.log("=============");

// console.log(await getClassScore("64558c7e1f1b16f3b1cbefe3"));
// console.log(
//   await getStudentScore("64558c7e1f1b16f3b1cbefe3", "64558c7d1f1b16f3b1cbefdd")
// );
