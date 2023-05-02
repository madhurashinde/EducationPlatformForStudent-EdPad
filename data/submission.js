import { assignment } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { assignmentFunc } from "./index.js";
import { validStr, validWeblink } from "../helper.js";

const createSubmission = async (
  assignmentId,
  studentId,
  submitFile,
  comment
) => {
  if (
    !validStr(assignmentId) ||
    !validStr(studentId) ||
    !validWeblink(submitFile)
  )
    throw "assignmentId, student or submitFile invalid";
  assignmentId = assignmentId.trim();
  if (!ObjectId.isValid(assignmentId)) throw "invalid assignmentId";
  studentId = studentId.trim();
  // if (!ObjectId.isValid(studentId)) throw "invalid studentId";

  const newAssignmentId = new ObjectId(assignmentId);
  const newStudentId = new ObjectId(studentId);

  // Students are not allowed to submit for multiple times. They can resubmit.
  const assignmentCollection = await assignment();
  const info = await assignmentCollection.findOne({
    $and: [{ _id: newAssignmentId }, { "submission.studentId": newStudentId }],
  });
  if (info !== null) {
    throw "You already submitted assignment and can only resubmit";
  }

  const submissionId = new ObjectId();
  let commentList = [];
  if (comment && validStr(comment)) {
    commentList.push([comment.trim(), studentId]);
  }

  let newSubmission = {
    _id: submissionId,
    studentId: newStudentId,
    submitFile: submitFile.trim(),
    comment: commentList,
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
  assignmentId = assignmentId.trim();
  studentId = studentId.trim();
  if (!validStr(assignmentId) || !validStr(studentId))
    throw "invalid assignmentId and studentId";
  if (!ObjectId.isValid(assignmentId) || !ObjectId.isValid(studentId))
    throw "invalid object Id";
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
  if (!validStr(assignmentId)) throw "invalid assignmentId";
  assignmentId = assignmentId.trim();
  if (!ObjectId.isValid(assignmentId)) throw "invalid assignmentId";
  const assignment = await assignmentFunc.getAssignment(assignmentId);
  let submissionList = assignment.submission;
  let res = [];
  submissionList.map((element) => {
    element._id = element._id.toString();
    res.push(element);
  });
  return [assignment.score, res];
};

// Student can resubmit their assignment
const resubmitSubmission = async (
  assignmentId,
  studentId,
  submitFile,
  comment
) => {
  if (!validStr(assignmentId) || !validStr(studentId))
    throw "invalid object Id";
  if (validStr(submitFile) && !validWeblink(submitFile))
    throw "invalid file link";
  assignmentId = assignmentId.trim();
  studentId = studentId.trim();
  if (!ObjectId.isValid(assignmentId) || !ObjectId.isValid(studentId))
    throw "invalid object ID";
  const assignmentCollection = await assignment();
  const newAssignmentId = new ObjectId(assignmentId);
  const newStudentId = new ObjectId(studentId);

  let submissionDetail = await assignmentCollection.findOne(
    {
      $and: [
        { _id: newAssignmentId },
        { "submission.studentId": newStudentId },
      ],
    },
    { projection: { "submission.$": 1 } }
  );
  if (submissionDetail === null) throw "No submission yet";
  if (
    submitFile.trim() === submissionDetail.submission.submitFile &&
    !validStr(comment)
  )
    throw "the file is not updated";

  let commentList = [];
  if (validStr(comment)) {
    commentList.push([comment.trim(), studentId]);
  }
  let submissionFile = submitFile.trim();

  const createAssignmentId = submissionDetail._id.toString();
  const createStudentId = submissionDetail.submission[0].studentId.toString();

  const updatedInfo = await assignmentCollection.updateOne(
    { _id: newAssignmentId },
    { $pull: { submission: { studentId: newStudentId } } }
  );

  if (updatedInfo === null) {
    throw "could not update submission successfully";
  }

  await createSubmission(
    createAssignmentId,
    createStudentId,
    submissionFile,
    commentList
  );

  const newSubmissionDetail = await getSubmission(assignmentId, studentId);
  return newSubmissionDetail;
};

export default {
  createSubmission,
  getAllSubmission,
  getSubmission,
  resubmitSubmission,
};
