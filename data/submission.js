import { user, assignment } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { assignmentFunc } from "./index.js";
import { validStr, validId } from "../helper.js";

const createSubmission = async (assignmentId, studentId, submitFile) => {
  assignmentId = validId(assignmentId);
  studentId = validId(studentId);
  submitFile = validStr(submitFile);

  const newAssignmentId = new ObjectId(assignmentId);
  const newStudentId = new ObjectId(studentId);

  // student can only submit to current course
  const userCollection = await user();
  const inCourse = await userCollection.findOne(
    { _id: new ObjectId(studentId) },
    { projection: { courseInProgress: 1 } }
  );
  if (!inCourse) throw "invalid student id";

  const assignmentCollection = await assignment();
  const assignmentInfo = await assignmentCollection.findOne({
    _id: newAssignmentId,
  });
  if (!inCourse.courseInProgress.includes(assignmentInfo.courseId.toString()))
    throw "you are not in this course";

  // Students are not allowed to submit for multiple times. They can resubmit.

  const info = await assignmentCollection.findOne({
    $and: [{ _id: newAssignmentId }, { "submission.studentId": newStudentId }],
  });
  if (info !== null) {
    throw "You already submitted assignment and can only resubmit";
  }

  const submissionId = new ObjectId();

  let newSubmission = {
    _id: submissionId,
    studentId: newStudentId,
    submitFile: submitFile,
    comment: "",
    scoreGet: null,
  };

  const insertInfo = await assignmentCollection.updateOne(
    { _id: newAssignmentId },
    { $addToSet: { submission: newSubmission } }
  );
  if (!insertInfo.acknowledged) throw "Could not add submission";

  const submission = await getSubmission(assignmentId, studentId);
  return submission;
};

const getSubmission = async (assignmentId, studentId) => {
  assignmentId = validId(assignmentId);
  studentId = validId(studentId);
  const assignmentCollection = await assignment();
  const newAssignmentId = new ObjectId(assignmentId);
  const newStudentId = new ObjectId(studentId);
  let submission = await assignmentCollection.findOne(
    {
      $and: [
        { _id: newAssignmentId },
        { "submission.studentId": newStudentId },
      ],
    },
    { projection: { "submission.$": 1 } }
  );
  if (submission === null) return null;
  let submissionList = submission.submission;
  return submissionList[0];
};

const getAllSubmission = async (assignmentId) => {
  assignmentId = validId(assignmentId);
  const assignment = await assignmentFunc.getAssignment(assignmentId);
  let submissionList = assignment.submission;
  let res = [];
  submissionList.map((element) => {
    element._id = element._id.toString();
    res.push(element);
  });
  return [assignment.score, res];
};

const getCourseId = async (id) => {
  id = validId(id);
  const assignmentCollection = await assignment();
  const submissionInfo = await assignmentCollection.findOne(
    {
      "submission._id": new ObjectId(id),
    },
    { projection: { courseId: 1 } }
  );
  if (submissionInfo === null) throw "can not find the submission";
  const courseId = submissionInfo.courseId.toString();
  return courseId;
};

export default {
  createSubmission,
  getAllSubmission,
  getSubmission,
  getCourseId,
};
