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
  let studentIdList = [];
  let studentName = [];
  for (let i = 0; i < students.length; i++) {
    const studInfo = await userCollection.findOne({
      _id: new ObjectId(students[i]),
    });
    studentIdList.push(studInfo._id.toString());
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

  const assignments = [];
  for (let i = 0; i < assignmentList.length; i++) {
    assignments.push([
      assignmentList[i]._id.toString(),
      assignmentList[i].title,
      assignmentList[i].score,
    ]);
  }

  // get each student's grade for each assignment

  let res = {};
  for (let i = 0; i < students.length; i++) {
    let grades = {};
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
          projection: { "submission.$": 1 },
        }
      );

      // assignment Id, title, total score, his score

      if (hisAssignment === null) {
        grades[assignments[j][0]] = [
          studentIdList[i],
          studentName[i],
          assignments[j][1],
          assignments[j][2],
          "not yet submitted", // not submission
          false, // no grade
          false, // no comment
          "", // comment content
        ];
      } else if (hisAssignment.submission[0].scoreGet === null) {
        grades[assignments[j][0]] = [
          studentIdList[i],
          studentName[i],
          assignments[j][1],
          assignments[j][2],
          "not yet graded", // not graded
          false, // no grade
          false, // no comment
          "", // comment content
        ];
      } else {
        if (hisAssignment.submission[0].comment.trim() === "") {
          grades[assignments[j][0]] = [
            studentIdList[i],
            studentName[i],
            assignments[j][1],
            assignments[j][2],
            hisAssignment.submission[0].scoreGet,
            true, // graded
            false, // comment not exist
            "", // comment content
          ];
        } else {
          grades[assignments[j][0]] = [
            studentIdList[i],
            studentName[i],
            assignments[j][1],
            assignments[j][2],
            hisAssignment.submission[0].scoreGet,
            true, // graded
            true, // comment exist
            hisAssignment.submission[0].comment, // comment content
          ];
        }
      }
    }
    res[students[i]] = grades;
  }
  console.log("getCourseGrade", getCourseGrade);
  return res;
};

const getClassScore = async (courseId) => {
  courseId = validId(courseId);
  const allGrade = await getCourseGrade(courseId);
  if (allGrade === null) return {};
  const students = Object.keys(allGrade);
  let res = {};
  for (let i = 0; i < students.length; i++) {
    let total = 0;
    let get = 0;
    const allscore = allGrade[students[i]];
    console.log("getClassScore", allscore);
    // if (allscore === {})
    const allAssignment = Object.keys(allscore);
    for (let j = 0; j < allAssignment.length; j++) {
      if (typeof allscore[allAssignment[j]][4] === "number") {
        total += allscore[allAssignment[j]][3];
        get += allscore[allAssignment[j]][4];
      }
    }

    if (total === 0) {
      res[students[i]] = [0, allGrade[students[i]][allAssignment[0]][2]];
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
  console.log("getStudentScore", allGrade);
  const thisGrade = allGrade[studentId];
  return thisGrade;
};
export default { grade, getClassScore, getStudentScore };
