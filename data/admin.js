import { admin } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {
  checkNumberFormat,
  checkNameFormat,
  checkEmailAddress,
  validPassword,
  validRole,
  checkValidStr,
} from "../helper.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;

const createAdmin = async (
  firstName,
  lastName,
  adminCWID,
  emailAddress,
  password,
  major,
  role
) => {
  firstName = checkNameFormat(firstName);
  lastName = checkNameFormat(lastName);
  // adminCWID = checkNumberFormat(adminCWID);
  emailAddress = checkEmailAddress(emailAddress);
  password = validPassword(password);
  major = checkValidStr(major);
  role = validRole(role);

  const adminCollection = await admin();
  const adminList = await adminCollection.find({}).toArray();
  if (!adminList) throw "Could not get all the students";

  const hash = await bcrypt.hash(password, saltRounds);
  adminList.forEach((element) => {
    if ((element["emailAddress"] = emailAddress)) {
      throw `Error: Email Addrress already taken`;
    }
  });
  let newAdmin = {
    firstName: firstName,
    lastName: lastName,
    adminCWID: adminCWID,
    emailAddress: emailAddress,
    password: hash,
    major: major,
    role: role,
  };

  const insertInfo = await adminCollection.insertOne(newAdmin);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add an admin";

  return { insertedAdmin: true };
};

const checkAdmin = async (emailAddress, password) => {
  emailAddress = checkEmailAddress(emailAddress);
  password = validPassword(password);
  const compare = async (password, hash) => {
    return await bcrypt.compare(password, hash);
  };
  const adminCollection = await admin();
  const adminList = await adminCollection.find({}).toArray();
  if (!adminList) throw "Could not get all the faculty";
  let result = {};
  const admin = adminList.find((element) => {
    if (element["emailAddress"] === emailAddress) {
      return element;
    }
  });
  if (admin) {
    let comparePassword = await compare(password, admin.password);
    if (comparePassword) {
      result = {
        firstName: admin.firstName,
        lastName: admin.lastName,
        adminCWID: admin.facultyCWID,
        emailAddress: admin.emailAddress,
        role: admin.role,
        major: admin.major,
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
  createAdmin,
  checkAdmin,
};
