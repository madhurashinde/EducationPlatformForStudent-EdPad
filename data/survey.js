import { user } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr } from "../helper.js";
import { coursesFunc } from "../data/index.js";

const getAllsurvey = async (courseId) => {
  courseId = validId(courseId);
  const userCollection = await user();
  let student_list = await coursesFunc.getStudentList(courseId);
  let arr = [];
  for (let i in student_list) {
    let surveyColl = await userCollection.findOne({
      _id: new ObjectId(student_list[i]._id),
    });
    for (let j in surveyColl.surveys) {
      if (surveyColl.surveys[j].courseId === courseId) {
        arr.push(surveyColl.surveys[j].studentSurvey);
      }
    }
  }
  return arr;
};

const getSurveyByStudent = async (courseId, studentId) => {
  courseId = validId(courseId);
  studentId = validId(studentId);
  const userCollection = await user();
  const ifSurvey = await userCollection.findOne(
    {
      $and: [
        { _id: new ObjectId(studentId) },
        { "surveys.courseId": courseId },
      ],
    },
    { projection: { "surveys.studentSurvey.$": 1 } }
  );
  return ifSurvey;
};

const createSurvey = async (courseId, currUser, studentSurvey) => {
  let { _id } = currUser;
  let studentId = validId(_id);
  studentSurvey = validStr(studentSurvey);
  const userCollection = await user();

  const currentCourse = await userCollection.findOne(
    {
      _id: new ObjectId(studentId),
    },
    { projection: { courseInProgress: 1 } }
  );
  if (!currentCourse.courseInProgress.includes(courseId)) {
    return { error: "You are not authorized to this survey" };
  }
  const currStudent = await userCollection.findOne({
    $and: [
      {
        _id: new ObjectId(studentId),
      },
      { "surveys.courseId": courseId },
    ],
  });

  if (currStudent) {
    return { error: "You are not authorized to this survey" };
  }
  const newsurvey = {
    _id: new ObjectId(),
    courseId: courseId,
    studentSurvey: studentSurvey,
  };
  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(studentId) },
    { $addToSet: { surveys: newsurvey } },
    { returnDocument: "after" }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not submit survey successfully";
  }
  return { success: "success" };
};

export default { createSurvey, getAllsurvey, getSurveyByStudent };
