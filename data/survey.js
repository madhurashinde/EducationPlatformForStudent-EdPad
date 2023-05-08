import { user } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr } from "../helper.js";
import { coursesFunc } from "../data/index.js";

const createSurvey = async (courseId, currUser, studentSurvey) => {
  let { _id } = currUser;
  let studentId = validId(_id);
  let validSurvey = validStr(studentSurvey);
  const currCourse = await coursesFunc.getCourseByObjectID(courseId);
  let currCourseTitle = currCourse.courseTitle;
  const userCollection = await user();

  const currentCourse = await userCollection.findOne(
    {
      _id: new ObjectId(studentId),
    },
    { projection: { courseInProgression: 1 } }
  );
  if (!currentCourse.courseInProgression.includes(courseId)) {
    return { error: "You are not authorized to this survey" };
  }

  const currStudent = await userCollection.findOne({
    $and: [
      {
        _id: new ObjectId(studentId),
      },
      { "surveys.currCourseTitle": currCourseTitle },
    ],
  });

  if (!currStudent) {
    return { error: "You are not authorized to this survey" };
  }

  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(studentId) },
    { $push: { surveys: { [currCourseTitle]: validSurvey } } },
    { returnDocument: "after" }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not submit survey successfully";
  }
  return { success: "success" };
};

export default createSurvey;
