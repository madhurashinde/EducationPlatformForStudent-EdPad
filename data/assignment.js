import { assignment } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import moment from "moment";
import { validStr } from "../helper.js";

const createAssignment = async (
  title,
  courseId,
  dueDate,
  content,
  file,
  score
) => {
  if (
    !validStr(title) ||
    !validStr(courseId) ||
    !validStr(dueDate) ||
    !validStr(score)
  ) {
    throw "please provide title, courseID, dueDate and score";
  }
  courseId = courseId.trim();
  if (!ObjectId.isValid(courseId)) throw "invalid courseID";
  const newCourseId = new ObjectId(courseId);

  if (moment(dueDate, "YYYY-MM-DD", true).format() === "Invalid date") {
    throw "invalid dueDate";
  }
  if (!validStr(content) && !validStr(file))
    throw "must provide instruction of the assignment by text or file";
  score = score.trim();
  score = parseInt(score);
  if (!score || score === NaN || typeof score !== "number" || score < 0)
    throw "score must be valid number";
  let newAssignment = {
    title: title.trim(),
    courseId: newCourseId,
    dueDate: new Date(dueDate.trim()),
    content: content.trim(),
    file: file.trim(),
    score: score,
    submission: [],
  };

  const assignmentCollection = await assignment();
  const insertInfo = await assignmentCollection.insertOne(newAssignment);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add assignment";
  const newId = insertInfo.insertedId.toString();
  const assignmentDetail = await getAssignment(newId);
  return assignmentDetail;
};

const getAssignment = async (assignmentId) => {
  if (!validStr(assignmentId)) throw "invalid id";
  assignmentId = assignmentId.trim();
  if (!ObjectId.isValid(assignmentId)) throw "invalid object ID";
  const assignmentCollection = await assignment();
  let newId = new ObjectId(assignmentId);
  const assignmentDetail = await assignmentCollection.findOne({ _id: newId });
  if (assignmentDetail === null) throw "No assignment with that id";
  assignmentDetail._id = assignmentDetail._id.toString();
  assignmentDetail.courseId = assignmentDetail.courseId.toString();
  for (let i = 0; i < assignmentDetail.submission.length; i++) {
    assignmentDetail.submission[i]._id =
      assignmentDetail.submission[i]._id.toString();
  }
  return assignmentDetail;
};

const getAllAssignment = async (courseId) => {
  if (!validStr(courseId)) throw "invalid id";
  courseId = courseId.trim();
  if (!ObjectId.isValid(courseId)) throw "invalid object ID";
  const assignmentCollection = await assignment();
  const newCourseId = new ObjectId(courseId);
  let assignmentList = await assignmentCollection
    .find(
      { courseId: newCourseId },
      { projection: { _id: 1, title: 1, dueDate: 1, score: 1 } }
    )
    .toArray();
  if (!assignmentList) throw "Could not get all assignment";
  assignmentList = assignmentList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return assignmentList;
};

const removeAssignment = async (assignmentId) => {
  if (!validStr(assignmentId)) throw "invalid id";
  assignmentId = assignmentId.trim();
  if (!ObjectId.isValid(assignmentId)) throw "invalid object ID";
  const assignmentCollection = await assignment();
  const newId = new ObjectId(assignmentId);
  const deletionInfo = await assignmentCollection.findOneAndDelete({
    _id: newId,
  });
  if (deletionInfo.lastErrorObject.n === 0) {
    throw `Could not delete assignment with id of ${assignmentId}`;
  }
  return { assignmentId: assignmentId, deleted: true };
};

// The facilty can modify assignment title, instruction or dueDate
const updateAssignment = async (
  assignmentId,
  title,
  dueDate,
  content,
  file,
  score
) => {
  if (
    !validStr(assignmentId) ||
    !validStr(title) ||
    !validStr(dueDate) ||
    !validStr(score)
  )
    throw "please provide assignmentId, title, courseID, dueDate and score";
  assignmentId = assignmentId.trim();
  if (!ObjectId.isValid(assignmentId)) throw "invalid object ID";
  if (moment(dueDate, "YYYY-MM-DD", true).format() === "Invalid date") {
    throw "invalid dueDate";
  }
  if (!validStr(content) && !validStr(file))
    throw "must provide instruction of the assignment by text or file";
  score = score.trim();
  score = parseInt(score);
  if (!score || score === NaN || typeof score !== "number" || score < 0)
    throw "score must be valid number";

  const assignmentDetail = await getAssignment(assignmentId);
  if (
    title === assignmentDetail.title &&
    new Date(dueDate.trim()).getTime() === assignmentDetail.dueDate.getTime() &&
    content === assignmentDetail.content &&
    file === assignmentDetail.file &&
    score === assignmentDetail.score
  )
    throw "No updated info";
  const courseId = new ObjectId(assignmentDetail.courseId);
  let updatedAssignment = {
    title: title.trim(),
    courseId: courseId,
    dueDate: new Date(dueDate.trim()),
    content: content.trim(),
    file: file.trim(),
    score: score,
    submission: assignmentDetail.submission,
  };

  const assignmentCollection = await assignment();
  const newId = new ObjectId(assignmentId);
  const updatedInfo = await assignmentCollection.findOneAndReplace(
    { _id: newId },
    updatedAssignment
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw "could not update assignment successfully";
  }
  const newAssignment = await getAssignment(assignmentId);
  return newAssignment;
};

export default {
  createAssignment,
  getAllAssignment,
  getAssignment,
  removeAssignment,
  updateAssignment,
};
