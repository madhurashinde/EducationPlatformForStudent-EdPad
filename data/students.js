import { students } from "../config/mongoCollections.js";
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

const createStudent = async (
  firstName,
  lastName,
  studentCWID,
  emailAddress,
  gender,
  birthDate,
  password,
  major,
  courseCompleted,
  courseInProgress,
  role
) => {
  firstName = checkNameFormat(firstName);
  lastName = checkNameFormat(lastName);
  // studentCWID = checkNumberFormat(studentCWID);
  emailAddress = checkEmailAddress(emailAddress);
  // gender = checkNameFormat(gender);
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
  // courseCompleted = checkValidStr(courseCompleted);
  // courseInProgress = checkValidStr(courseInProgress);
  if (!checkValidArray(courseCompleted) || !checkValidArray(courseInProgress))
    throw "You must provide a valid course list";
  role = validRole(role);

  const studCollection = await students();
  const studList = await studCollection.find({}).toArray();
  if (!studList) throw "Could not get all the students";

  const hash = await bcrypt.hash(password, saltRounds);
  studList.forEach((element) => {
    if ((element["emailAddress"] = emailAddress)) {
      throw `Error: Email Addrress already taken`;
    }
  });
  let newStud = {
    firstName: firstName,
    lastName: lastName,
    studentCWID: studentCWID,
    emailAddress: emailAddress,
    gender: gender.trim().toLowerCase(),
    birthDate: birthDate,
    password: hash,
    major: major,
    courseCompleted: courseCompleted,
    courseInProgress: courseInProgress,
    role: role,
  };

  const insertInfo = await studCollection.insertOne(newStud);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add a student";

  return { insertedStud: true };
};

const checkStudent = async (emailAddress, password) => {
  emailAddress = checkEmailAddress(emailAddress);
  password = validPassword(password);
  const compare = async (password, hash) => {
    return await bcrypt.compare(password, hash);
  };
  const studCollection = await students();
  const studList = await studCollection.find({}).toArray();
  if (!studList) throw "Could not get all the students";
  let result = {};
  const stud = studList.find((element) => {
    if (element["emailAddress"] === emailAddress) {
      return element;
    }
  });
  if (stud) {
    let comparePassword = await compare(password, stud.password);
    if (comparePassword) {
      result = {
        firstName: stud.firstName,
        lastName: stud.lastName,
        studentCWID: stud.studentCWID,
        emailAddress: stud.emailAddress,
        role: stud.role,
        gender: stud.gender,
        birthDate: stud.birthDate,
        major: stud.major,
        courseCompleted: stud.courseCompleted,
        courseInProgress: stud.courseInProgress,
      };
    } else {
      throw `3Either the emailAddress or password is invalid`;
    }
  } else {
    throw `4Either the emailAddress or password is invalid`;
  }
  return result;
};

export default {
  createStudent,
  checkStudent,
};
