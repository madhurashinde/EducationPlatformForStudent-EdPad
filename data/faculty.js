import { faculty } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

import {
  checkNumberFormat,
  checkBirthDateFormat,
  checkNameFormat,
  checkEmailAddress,
  validPassword,
  validRole,
  checkValidStr,
  checkValidArray,
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
    (gender.trim().toLowerCase() !== "male" &&
      gender.trim().toLowerCase() !== "female")
  )
    throw "Gender is not valid";

  birthDate = checkBirthDateFormat(birthDate);
  password = validPassword(password);
  major = checkValidStr(major);
  // courseTaught = checkValidStr(courseTaught);
  // courseInProgress = checkValidStr(courseInProgress);
  if (!checkValidArray(courseTaught) || !checkValidArray(courseInProgress))
    throw "You must provide a valid course list";
  role = validRole(role);

  const facCollection = await faculty();
  // facList.forEach((element) => {
  //   if ((element["emailAddress"] = emailAddress)) {
  //     throw `Error: Email Addrress already taken`;
  //   }
  // });
  const facList = await facCollection.findOne({ emailAddress: emailAddress });
  if (facList) throw "This email address has an associated account";

  const hash = await bcrypt.hash(password, saltRounds);

  let newFaculty = {
    firstName: firstName,
    lastName: lastName,
    facultyCWID: facultyCWID,
    emailAddress: emailAddress,
    gender: gender.trim().toLowerCase(),
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
  const facultyList = facList.find((element) => {
    if (element["emailAddress"] === emailAddress) {
      return element;
    }
  });
  if (facultyList) {
    // let comparePassword = await compare(password, faculty.password);
    let comparePassword = true;
    if (comparePassword) {
      result = {
        firstName: facultyList.firstName,
        lastName: facultyList.lastName,
        facultyCWID: facultyList.facultyCWID,
        emailAddress: facultyList.emailAddress,
        role: facultyList.role,
        gender: facultyList.gender,
        birthDate: facultyList.birthDate,
        major: facultyList.major,
        courseTaught: facultyList.courseTaught,
        courseInProgress: facultyList.courseInProgress,
      };
    } else {
      throw `3Either the emailAddress or password is invalid`;
    }
  }

  return result;
};

export default {
  createFaculty,
  checkFaculty,
};
