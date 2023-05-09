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

  const submissionId = new ObjectId();

  let newSubmission = {
    _id: submissionId,
    studentId: newStudentId,
    submitFile: submitFile,
    comment: "",
    scoreGet: null,
  };

  const ifSubmit = await assignmentCollection.findOne({
    $and: [{ _id: newAssignmentId }, { "submission.studentId": newStudentId }],
  });

  if (ifSubmit) {
    const deletionInfo = await assignmentCollection.updateOne(
      { _id: newAssignmentId },
      { $pull: { submission: { studentId: newStudentId } } }
    );
    if (!deletionInfo.acknowledged) {
      throw "Can not delete current assignment";
    }
  }

  const insertInfo = await assignmentCollection.findOneAndUpdate(
    { _id: newAssignmentId },
    { $addToSet: { submission: newSubmission } }
  );
  if (!insertInfo.lastErrorObject.n === 0) throw "Could not add submission";

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

const addComment = async (assignmentId, studentId, comment) => {
  assignmentId = validId(assignmentId);
  studentId = validId(studentId);
  comment = validStr(comment);
  const assignmentCollection = await assignment();

  const submission = await assignmentCollection.findOne({
    $and: [
      { _id: new ObjectId(assignmentId) },
      { "submission.studentId": new ObjectId(studentId) },
    ],
  });
  if (!submission) {
    throw "You have not submitted assignment";
  }

  const update = await assignmentCollection.findOneAndUpdate(
    {
      $and: [
        { _id: new ObjectId(assignmentId) },
        { "submission.studentId": new ObjectId(studentId) },
      ],
    },
    { $set: { "submission.$.comment": comment } }
  );
  if (update.lastErrorObject.n === 0) {
    throw "could not update comment successfully";
  }
  return comment;
};

export default {
  createSubmission,
  getAllSubmission,
  getSubmission,
  getCourseId,
  addComment,
};
