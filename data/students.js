import { student } from "../config/mongoCollections.js";
import {
  validCWID,
  checkBirthDateFormat,
  checkNameFormat,
  checkEmailAddress,
  validPassword,
  validRole,
  checkValidMajor,
  checkValidArray,
  validGender,
} from "../helper.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;

const createStudent = async (
  firstName,
  lastName,
  CWID,
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
  CWID = validCWID(CWID);
  emailAddress = checkEmailAddress(emailAddress);
  gender = validGender(gender);
  birthDate = checkBirthDateFormat(birthDate);
  password = validPassword(password);
  major = checkValidMajor(major);
  courseCompleted = checkValidArray(courseCompleted);
  courseInProgress = checkValidArray(courseInProgress);
  role = validRole(role);

  const studCollection = await student();
  const studEmail = await studCollection.findOne({
    emailAddress: emailAddress,
  });
  if (studEmail) throw "This email address has an associated account";
  const hash = await bcrypt.hash(password, saltRounds);
  const newStud = {
    firstName: firstName,
    lastName: lastName,
    CWID: CWID,
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
  const id = insertInfo.insertedId;
  const newStudent = await studCollection.findOne(
    {
      _id: id,
    },
    { projection: { password: 0 } }
  );
  newStudent._id = newStudent._id.toString();
  return newStudent;
};

const checkStudent = async (emailAddress, password) => {
  emailAddress = checkEmailAddress(emailAddress);
  password = validPassword(password);
  const studCollection = await student();
  const stud = await studCollection.findOne({ emailAddress: emailAddress });
  if (stud) {
    const compare = async (password, hash) => {
      return await bcrypt.compare(password, hash);
    };
    const comparePassword = await compare(password, stud.password);
    if (comparePassword) {
      const res = await studCollection.findOne(
        {
          emailAddress: emailAddress,
        },
        { projection: { password: 0 } }
      );
      res._id = res._id.toString();
      return res;
    } else {
      throw `Either the emailAddress or password is invalid`;
    }
  } else {
    throw `Either the emailAddress or password is invalid`;
  }
};

export default {
  createStudent,
  checkStudent,
};
