import { registration, user } from "../config/mongoCollections.js";

const initRegistrationStatus = async () => {
  const regCollection = await registration();
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
};
