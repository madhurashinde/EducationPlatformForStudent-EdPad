import e from "express";
import { admin } from "../config/mongoCollections.js";
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

const createAdmin = async (
  firstName,
  lastName,
  CWID,
  emailAddress,
  password,
  major,
  role
) => {
  firstName = checkNameFormat(firstName);
  lastName = checkNameFormat(lastName);
  CWID = validCWID(CWID);
  emailAddress = checkEmailAddress(emailAddress);
  password = validPassword(password);
  major = checkValidMajor(major);
  role = validRole(role);

  const adminCollection = await admin();
  const adminEmail = await adminCollection.findOne({
    emailAddress: emailAddress,
  });
  if (adminEmail) {
    throw "This admin email address has an associated account";
  }
  const hash = await bcrypt.hash(password, saltRounds);
  const newAd = {
    firstName: firstName,
    lastName: lastName,
    CWID: CWID,
    emailAddress: emailAddress,
    password: hash,
    major: major,
    role: role,
  };

  const insertInfo = await adminCollection.insertOne(newAd);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add an admin";
  const id = insertInfo.insertedId;
  const newAdmin = await adminCollection.findOne(
    {
      _id: id,
    },
    { projection: { password: 0 } }
  );
  newAdmin._id = newAdmin._id.toString();
  return newAdmin;
};

const checkAdmin = async (emailAddress, password) => {
  emailAddress = checkEmailAddress(emailAddress);
  password = validPassword(password);
  const adminCollection = await admin();
  const adm = await adminCollection.findOne({
    emailAddress: emailAddress,
  });
  if (adm) {
    const compare = async (password, hash) => {
      return await bcrypt.compare(password, hash);
    };
    const comparePassword = await compare(password, adm.password);
    if (comparePassword) {
      const res = await adminCollection.findOne(
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
  createAdmin,
  checkAdmin,
};
