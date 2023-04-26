import { courses_func } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
// import moment from "moment";
// import { validStr } from "../helper.js";


const createCourse = async (
    courseTitle,
    courseId,
    description,
    professorId,
    professorName,
    studentlist,
    announcement
) => {

    let newCourse = {
        courseTitle: courseTitle,
        courseId: courseId,
        description: description,
        professorId: professorId,
        professorName: professorName,
        studentlist: [],
        announcement: [],
    };

    const courseCollection = await courses_func();
    const insertInfo = await courseCollection.insertOne(newCourse);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw "Could not add newCourse";
    console.log(insertInfo)
    const newId = insertInfo.insertedId.toString();
    // const assignmentDetail = await getAssignment(newId);
    return insertInfo;

}


export { createCourse }