import {
    courses_func,
    faculty,
    students,
    admin,
} from "../config/mongoCollections.js";
// import { faculty, students, admin } from "../config/mongoCollections.js";

import { ObjectId } from "mongodb";
// import moment from "moment";
// import { validStr } from "../helper.js";

const createCourse = async (
    courseTitle,
    courseId,
    description,
    professorId,
    professorName
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

    if (
        !courseTitle ||
        !courseId ||
        !description ||
        !professorId ||
        !professorName
    ) {
        throw "All fields need to have valid values";
    }
    if (typeof courseTitle !== "string") throw "courseTitle must be a string";
    if (courseTitle.trim().length === 0)
        throw "courseTitle cannot be an empty string or just spaces";

    if (typeof courseId !== "string") throw "courseId must be a string";
    if (courseId.trim().length === 0)
        throw "courseId cannot be an empty string or just spaces";

    if (typeof description !== "string") throw "description must be a string";
    if (description.trim().length === 0)
        throw "description cannot be an empty string or just spaces";

    if (typeof professorId !== "string") throw "professorId must be a string";
    if (professorId.trim().length === 0)
        throw "professorId cannot be an empty string or just spaces";

    if (typeof professorName !== "string") throw "professorName must be a string";
    if (professorName.trim().length === 0)
        throw "professorName cannot be an empty string or just spaces";

    const courseCollection = await courses_func();
    const insertInfo = await courseCollection.insertOne(newCourse);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw "Could not add newCourse";
    console.log(insertInfo);
    const newId = insertInfo.insertedId.toString();
    // const assignmentDetail = await getAssignment(newId);
    return insertInfo;
};

const getAll = async () => {
    const courseCollection = await courses_func();
    const allCourse = await courseCollection.find().toArray();
    for (let i of allCourse) {
        i._id = i._id.toString();
    }

    return allCourse;
};

const getCourseByCID = async (id) => {
    if (!id) throw "Must provide an id to search for";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0)
        throw "Id cannot be an empty string or just spaces";
    id = id.trim();
    id = id.toUpperCase();
    // if (!ObjectId.isValid(id)) throw 'invalid object ID';

    const courseCollection = await courses_func();
    const course = await courseCollection.findOne({ courseId: id });
    if (!course) {
        throw "course not found";
    }
    course._id = course._id.toString();
    return course;
};

const getCourseByCWID = async (id) => {
    if (!id) throw "Must provide an id to search for";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0)
        throw "Id cannot be an empty string or just spaces";
    id = id.trim();
    // id = id.toUpperCase();

    let studCollection = await students();

    let stud = await studCollection.findOne({ studentCWID: id });
    //

    let studCoursesList = await stud.courseInProgress;
    let specificCourses = [];
    let speciCor;
    // let findCourse() => { }
    for (let i of studCoursesList) {
        speciCor = await getCourseByCID(i);
        specificCourses.push(speciCor);
    }
    return specificCourses;
};


const getCourseByStudentEmail = async (email) => {


    let studCollection = await students();

    let stud = await studCollection.findOne({ emailAddress: email });
    //

    let studCoursesList = await stud.courseInProgress;
    let specificCourses = [];
    let speciCor;
    // let findCourse() => { }
    for (let i of studCoursesList) {
        speciCor = await getCourseByCID(i);
        specificCourses.push(speciCor);
    }
    return specificCourses;
};


const getCourseByFacultyEmail = async (email) => {


    let facultyCollection = await faculty();

    let specificFaculty = await facultyCollection.findOne({ emailAddress: email });
    //

    let facultyCoursesList = await specificFaculty.courseInProgress;
    let specificCourses = [];
    let speciCor;
    // let findCourse() => { }
    for (let i of facultyCoursesList) {
        speciCor = await getCourseByCID(i);
        specificCourses.push(speciCor);
    }
    // console.log(specificCourses)
    return specificCourses;
};


const getCourseByObjectID = async (id) => {
    if (!id) throw "Must provide an id to search for";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0)
        throw "Id cannot be an empty string or just spaces";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';


    const courseCollection = await courses_func();
    const course = await courseCollection.findOne({ _id: new ObjectId(id) });
    if (!course) {
        throw "course does not exist";
    }
    course._id = course._id.toString();
    return course
};
export default { createCourse, getAll, getCourseByCID, getCourseByCWID, getCourseByStudentEmail, getCourseByFacultyEmail, getCourseByObjectID };
