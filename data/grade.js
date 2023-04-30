import { assignment } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validStr } from "../helper.js";

const grade = async (submissionId, grade) => {
  if (!validStr(submissionId) || !validStr(grade))
    throw "invalid submissionId or grade";
  submissionId = submissionId.trim();
  if (!ObjectId.isValid(submissionId)) throw "invalid object Id";
  grade = grade.trim();
  grade = Number(grade);
  if (!grade || grade === NaN || grade < 0) throw "invalid grade";

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
  if (!validStr(courseId) || !validStr(studentId)) throw "invalid studentId";
  courseId = courseId.trim();
  studentId = studentId.trim();
  if (!ObjectId.isValid(courseId) || !ObjectId.isValid(studentId))
    throw "invalid object Id";
  const newCourseId = new ObjectId(courseId);
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
    res.push({
      _id: allGrade[i]._id,
      title: allGrade[i].title,
      score: allGrade[i].score.toFixed(2),
      scoreGet: allGrade[i].submission.scoreGet,
    });
  }
  return res;
};

export default { grade, getAllGrade };
