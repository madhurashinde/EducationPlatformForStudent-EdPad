import { assignment } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

import {
  validStr,
  validId,
  nonNegInt,
  validDueTime,
  validDate,
  validTime,
} from "../helper.js";

const createAssignment = async (
  title,
  courseId,
  dueDate,
  dueTime,
  content,
  file,
  score
) => {
  courseId = validId(courseId);
  const newCourseId = new ObjectId(courseId);
  title = validStr(title);
  dueDate = validDate(dueDate);
  dueTime = validTime(dueTime);
  if (!validDueTime(dueDate, dueTime)) {
    throw "invalid dueDate";
  }
  content = validStr(content);
  file = validStr(file);
  score = nonNegInt(score);

  const newAssignment = {
    title: title,
    courseId: newCourseId,
    dueDate: dueDate,
    dueTime: dueTime,
    content: content,
    file: file,
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
  assignmentId = validId(assignmentId);
  const assignmentCollection = await assignment();
  const newId = new ObjectId(assignmentId);
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
  courseId = validId(courseId);
  const assignmentCollection = await assignment();
  const newCourseId = new ObjectId(courseId);
  let assignmentList = await assignmentCollection
    .find(
      { courseId: newCourseId },
      { projection: { _id: 1, title: 1, dueDate: 1, dueTime: 1, score: 1 } }
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
  assignmentId = validId(assignmentId);
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
  dueTime,
  content,
  file,
  score
) => {
  assignmentId = validId(assignmentId);
  title = validStr(title);
  dueDate = validDate(dueDate);
  dueTime = validTime(dueTime);
  if (!validDueTime(dueDate.trim(), dueTime.trim())) {
    throw "invalid dueDate";
  }
  if (!validStr(content) && !validStr(file))
    throw "must provide instruction of the assignment by text or file";
  score = nonNegInt(score);

  const assignmentDetail = await getAssignment(assignmentId);
  if (
    title === assignmentDetail.title &&
    dueDate === assignmentDetail.dueDate &&
    dueTime === assignmentDetail.dueTime &&
    content === assignmentDetail.content &&
    file === assignmentDetail.file &&
    score === assignmentDetail.score
  )
    throw "No updated info";

  let updatedAssignment = {
    title: title,
    courseId: assignmentDetail.courseId,
    dueDate: dueDate,
    dueTime: dueTime,
    content: content,
    file: file,
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

const getCourseId = async (id) => {
  id = validId(id);
  const assignmentCollection = await assignment();
  const assignmentInfo = await assignmentCollection.findOne(
    {
      _id: new ObjectId(id),
    },
    { projection: { courseId: 1 } }
  );
  if (assignmentInfo === null) throw "can not find the assignment";
  const courseId = assignmentInfo.courseId.toString();
  return courseId;
};

export default {
  createAssignment,
  getAllAssignment,
  getAssignment,
  removeAssignment,
  updateAssignment,
  getCourseId,
};
