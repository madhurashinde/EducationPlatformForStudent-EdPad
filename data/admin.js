import {
  registration,
  major,
  user,
  course,
} from "../config/mongoCollections.js";
import { validStr } from "../helper.js";

const addMajor = async (str) => {
  str = validStr(str).toLowerCase();
  const majorCollection = await major();
  const majorInfo = await majorCollection.findOne({ major: str });
  if (majorInfo !== null) throw "Major already exists";
  const insertInfo = await majorCollection.insertOne({
    major: str,
  });
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add major";
  return "success";
};

const getAllMajors = async () => {
  const majorCollection = await major();
  const majorInfo = await majorCollection.find({}).toArray();
  let majors = [];
  for (let i = 0; i < majorInfo.length; i++) {
    majors.push(majorInfo[i].major);
  }
  return majors;
};

const initRegistrationStatus = async () => {
  const regCollection = await registration();
  const registrationStatus = await regCollection.find({}).toArray();
  if (registrationStatus.length === 1) {
    throw "Registration already exists";
  }
  const insertInfo = await regCollection.insertOne({
    Enableregistration: false,
  });
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not initialize value for registration control";
  return "success";
};

const registrationStatus = async () => {
  const registCollection = await registration();
  const status = await registCollection.find({}).toArray();
  return status[0].Enableregistration;
};

const changeStatus = async () => {
  const registCollection = await registration();
  const status = await registrationStatus();
  let updatedInfo = null;
  if (status) {
    updatedInfo = await registCollection.updateOne(
      { Enableregistration: status },
      { $set: { Enableregistration: false } }
    );
  } else {
    updatedInfo = await registCollection.updateOne(
      { Enableregistration: status },
      { $set: { Enableregistration: true } }
    );
  }
  if (updatedInfo === null) {
    throw "could not update registration status successfully";
  }
  const newStatus = await registrationStatus();
  return { Enableregistration: newStatus };
};

const archive = async () => {
  const userCollection = await user();
  const userList = await userCollection
    // .find({ role: { $in: ["student", "faculty"] } }, { projection: { _id: 1 } })
    .find({ role: { $in: ["student"] } }, { projection: { _id: 1 } })
    .toArray();
  for (let i = 0; i < userList.length; i++) {
    const thisUser = await userCollection.findOne(
      { _id: userList[i]._id },
      { projection: { courseInProgress: 1, courseCompleted: 1 } }
    );
    const courseInProgress = thisUser.courseInProgress;
    const courseCompleted = thisUser.courseCompleted;

    const updateInfo = await userCollection.findOneAndUpdate(
      { _id: userList[i]._id },
      {
        $set: {
          courseInProgress: [],
          courseCompleted: courseCompleted.concat(courseInProgress),
        },
      }
    );
    if (updateInfo.lastErrorObject.n === 0) {
      throw "could not update profile successfully";
    }
  }

  const courseCollection = await course();
  const allCourses = await courseCollection.find({}).toArray();
  for (let i = 0; i < allCourses.length; i++) {
    const updateInfo = await courseCollection.findOneAndUpdate(
      { _id: allCourses[i]._id },
      { $set: { studentlist: [] } }
    );
    if (updateInfo.lastErrorObject.n === 0) {
      throw "could not update course successfully";
    }
  }

  return "Successfully Archived";
};

export default {
  initRegistrationStatus,
  registrationStatus,
  changeStatus,
  archive,
  addMajor,
  getAllMajors,
};
