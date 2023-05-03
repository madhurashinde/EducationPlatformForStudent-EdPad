import { faculty } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {
  checkNumberFormat,
  checkBirthDateFormat,
  checkNameFormat,
  checkEmailAddress,
  validPassword,
  validRole,
} from "../helper.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;

const createFaculty = async (
  firstName,
  lastName,
  facultyCWID,
  emailAddress,
  gender,
  birthDate,
  password,
  major,
  courseTaught,
  courseInProgress,
  role
) => {
  firstName = checkNameFormat(firstName);
  lastName = checkNameFormat(lastName);
  // facultyCWID = checkNumberFormat(facultyCWID);
  emailAddress = checkEmailAddress(emailAddress);
  if (
    !gender ||
    typeof gender !== "string" ||
    gender.trim().toLowerCase() !== "male" ||
    gender.trim().toLowerCase() !== "female"
  )
    throw "Gender is not valid";
  birthDate = checkBirthDateFormat(birthDate);
  password = validPassword(password);
  role = validRole(role);
  major = checkValidStr(major);
  courseTaught = checkValidStr(courseTaught);
  courseInProgress = checkValidStr(courseInProgress);

  const facCollection = await faculty();
  const facList = await facCollection.find({}).toArray();
  if (!facList) throw "Could not get all the students";

  const hash = await bcrypt.hash(password, saltRounds);
  facList.forEach((element) => {
    if ((element["emailAddress"] = emailAddress)) {
      throw `Error: Email Addrress already taken`;
    }
  });
  let newFaculty = {
    firstName: firstName,
    lastName: lastName,
    facultyCWID: facultyCWID,
    emailAddress: emailAddress,
    gender: gender,
    birthDate: birthDate,
    password: hash,
    major: major,
    courseTaught: courseTaught,
    courseInProgress: courseInProgress,
    role: role,
  };

  const insertInfo = await facCollection.insertOne(newFaculty);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add faculty";

  return { insertedFaculty: true };
};

const checkFaculty = async (emailAddress, password) => {
  emailAddress = checkEmailAddress(emailAddress);
  password = validPassword(password);
  const compare = async (password, hash) => {
    return await bcrypt.compare(password, hash);
  };
  const facCollection = await faculty();
  const facList = await facCollection.find({}).toArray();
  if (!facList) throw "Could not get all the faculty";
  let result = {};
  const faculty = facList.find((element) => {
    if (element["emailAddress"] === emailAddress) {
      return element;
    }
  });
  if (faculty) {
    let comparePassword = await compare(password, faculty.password);
    if (comparePassword) {
      result = {
        firstName: faculty.firstName,
        lastName: faculty.lastName,
        facultyCWID: faculty.facultyCWID,
        emailAddress: faculty.emailAddress,
        role: faculty.role,
        gender: faculty.gender,
        birthDate: faculty.birthDate,
        major: faculty.major,
        courseTaught: faculty.courseTaught,
        courseInProgress: faculty.courseInProgress,
      };
    } else {
      throw `Either the emailAddress or password is invalid`;
    }
  } else {
    throw `Either the emailAddress or password is invalid`;
  }
  return result;
};

export default {
  createFaculty,
  checkFaculty,
};
