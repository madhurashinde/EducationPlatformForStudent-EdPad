import { assignment } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validStr, validId, nonNegInt } from "../helper.js";

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

// add courseId
const getAllGrade = async (courseId, studentId) => {
  courseId = validId(courseId);
  studentId = validId(studentId);
  const newStudentId = new ObjectId(studentId);
  const assignemntCollection = await assignment();
  const allGrade = await assignemntCollection
    .find(
      { "submission.studentId": newStudentId },
      { projection: { _id: 1, title: 1, score: 1, "submission.$": 1 } }
    )
    .toArray();
  if (allGrade.length === 0) return null;
  let res = [];
  for (let i = 0; i < allGrade.length; i++) {
    if (allGrade[i].submission[0].scoreGet) {
      res.push({
        _id: allGrade[i]._id,
        title: allGrade[i].title,
        score: allGrade[i].score.toFixed(2),
        scoreGet: allGrade[i].submission[0].scoreGet.toFixed(2),
      });
    } else {
      res.push({
        _id: allGrade[i]._id,
        title: allGrade[i].title,
        score: allGrade[i].score.toFixed(2),
        scoreGet: null,
      });
    }
  }
  return res;
};

export default { grade, getAllGrade };
