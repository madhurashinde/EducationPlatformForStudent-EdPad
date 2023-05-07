import { course, user } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr } from "../helper.js";
import { coursesFunc } from "../data/index.js";

const createSurvey = async (courseId , currUser , studentSurvey) => {
        let {_id} = currUser;
        let studentId = validId(_id);
        let validSurvey = validStr(studentSurvey);
        const currCourse = await coursesFunc.getCourseByObjectID(courseId);
        let currCourseTitle = currCourse.courseTitle;
        const userCollection = await user();

  const currStudent = await userCollection.findOne({ _id: new ObjectId(studentId) });
  if (!currStudent) {
    throw "Student does not exist";
  }

  if(currStudent.surveys.length >0){
  currStudent.surveys.forEach((i)=>{
    if(i[currCourseTitle]){
        throw "You have already provided the survey"
    }
  })
}
         const updatedInfo = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(studentId)},
            { $push: { surveys: { [currCourseTitle]: validSurvey } } },
            {returnDocument: 'after'}
          );
          if (updatedInfo.modifiedCount === 0) {
            throw 'could not update band name successfully';
          }
            return updatedInfo;

  
}

  export default createSurvey