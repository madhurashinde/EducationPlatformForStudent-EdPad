import { registration, major, user } from "../config/mongoCollections.js";
import { validStr } from "../helper.js";

const addMajor = async (str) => {
  str = validStr(str).toLowerCase();
  const majorCollection = await major();
  const majorInfo = majorCollection.findOne({ major: strVal });
  if (majorInfo !== null) throw "Major already exists";
  const insertInfo = await majorCollection.insertOne({
    major: str,
  });
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add major";
  return "success";
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

//pending
const archive = async () => {
  const userCollection = await user();
  const faculty = await userCollection.find({ role: "faculty" }).toArray();
};

export default {
  initRegistrationStatus,
  registrationStatus,
  changeStatus,
  archive,
  addMajor,
};
