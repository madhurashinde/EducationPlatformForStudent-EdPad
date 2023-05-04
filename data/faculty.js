import { faculty } from "../config/mongoCollections.js";
import {
  validCWID,
  checkBirthDateFormat,
  checkNameFormat,
  checkEmailAddress,
  validPassword,
  checkValidMajor,
  validGender,
} from "../helper.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;

const createFaculty = async (
  firstName,
  lastName,
  CWID,
  emailAddress,
  gender,
  birthDate,
  password,
  major
) => {
  firstName = checkNameFormat(firstName);
  lastName = checkNameFormat(lastName);
  CWID = validCWID(CWID);
  emailAddress = checkEmailAddress(emailAddress);
  gender = validGender(gender);
  birthDate = checkBirthDateFormat(birthDate);
  password = validPassword(password);
  major = checkValidMajor(major);

  const facCollection = await faculty();
  const facList = await facCollection.findOne({ emailAddress: emailAddress });
  if (facList) throw "This email address has an associated account";
  const hash = await bcrypt.hash(password, saltRounds);
  const newFac = {
    firstName: firstName,
    lastName: lastName,
    CWID: CWID,
    emailAddress: emailAddress,
    gender: gender,
    birthDate: birthDate,
    password: hash,
    major: major,
    courseTaught: [],
    courseInProgress: [],
    role: "faculty",
  };

  const insertInfo = await facCollection.insertOne(newFac);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add faculty";
  const id = insertInfo.insertedId;
  const newFaculty = await facCollection.findOne(
    {
      _id: id,
    },
    { projection: { password: 0 } }
  );
  newFaculty._id = newFaculty._id.toString();
  return newFaculty;
};

const checkFaculty = async (emailAddress, password) => {
  emailAddress = checkEmailAddress(emailAddress);
  password = validPassword(password);
  const facCollection = await faculty();
  const fac = await facCollection.findOne({ emailAddress: emailAddress });
  if (fac) {
    const compare = async (password, hash) => {
      return await bcrypt.compare(password, hash);
    };
    const comparePassword = await compare(password, fac.password);
    if (comparePassword) {
      const res = await facCollection.findOne(
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
  createFaculty,
  checkFaculty,
};
