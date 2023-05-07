import { user } from "../config/mongoCollections.js";
import {
  checkBirthDateFormat,
  checkNameFormat,
  checkEmailAddress,
  validPassword,
  checkValidMajor,
  validGender,
  validRole,
} from "../helper.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;

const createUser = async (
  firstName,
  lastName,
  emailAddress,
  gender,
  birthDate,
  password,
  major,
  role
) => {
  firstName = checkNameFormat(firstName);
  lastName = checkNameFormat(lastName);
  emailAddress = checkEmailAddress(emailAddress);
  gender = validGender(gender);
  birthDate = checkBirthDateFormat(birthDate);
  password = validPassword(password);
  major = await checkValidMajor(major);
  role = validRole(role);

  const userCollection = await user();
  const userEmail = await userCollection.findOne({
    emailAddress: emailAddress,
  });
  if (userEmail) throw "This email address has an associated account";
  const hash = await bcrypt.hash(password, saltRounds);
  const newUser = {
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    gender: gender,
    birthDate: birthDate,
    password: hash,
    major: major,
    courseCompleted: [],
    courseInProgress: [],
    role: role,
    surveys:[],
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add this user";
  const id = insertInfo.insertedId;
  const userInfo = await userCollection.findOne(
    {
      _id: id,
    },
    { projection: { password: 0 } }
  );
  userInfo._id = userInfo._id.toString();
  return userInfo;
};

const checkUser = async (emailAddress, password) => {
  emailAddress = checkEmailAddress(emailAddress);
  password = validPassword(password);
  const userCollection = await user();
  const userEmail = await userCollection.findOne({
    emailAddress: emailAddress,
  });
  if (userEmail) {
    const compare = async (password, hash) => {
      return await bcrypt.compare(password, hash);
    };
    const comparePassword = await compare(password, userEmail.password);
    if (comparePassword) {
      const res = await userCollection.findOne(
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

const allFaculty = async () => {
  const userCollection = await user();
  const faculty = userCollection.find({ role: "faculty" }).toArray();
  return faculty;
};

const allStudent = async () => {
  const userCollection = await user();
  const student = userCollection.find({ role: "student" }).toArray();
  return student;
};

export default {
  createUser,
  checkUser,
  allFaculty,
  allStudent,
};
