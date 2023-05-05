import { course, faculty, student, admin } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

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



    const courseCollection = await course();
    const insertInfo = await courseCollection.insertOne(newCourse);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw "Could not add newCourse";
    const newId = insertInfo.insertedId.toString();
    const courseDetail = await getCourseByObjectID(newId);
    return courseDetail;
};

const getAll = async () => {
    const courseCollection = await course();
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

    const courseCollection = await course();
    const courseInfo = await courseCollection.findOne({ courseId: id });
    if (!courseInfo) {
        throw "course not found";
    }
    courseInfo._id = courseInfo._id.toString();
    return courseInfo;
};

const getCourseByCWID = async (id) => {
    if (!id) throw "Must provide an id to search for";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0)
        throw "Id cannot be an empty string or just spaces";
    id = id.trim();
    // id = id.toUpperCase();

    let studCollection = await student();

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
    let studCollection = await student();

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

    let specificFaculty = await facultyCollection.findOne({
        emailAddress: email,
    });
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
    if (!ObjectId.isValid(id)) throw "invalid object ID";

    const courseCollection = await course();
    const courseInfo = await courseCollection.findOne({ _id: new ObjectId(id) });
    if (!courseInfo) {
        throw "course does not exist";
    }
    courseInfo._id = courseInfo._id.toString();
    return courseInfo;
};

// -----------------------------------------------------
const getStudentCurrentCourse = async (id) => {
    if (!id) throw "Must provide an id to search for";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0)
        throw "Id cannot be an empty string or just spaces";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "invalid object ID";
    const studCollection = await student();
    const courseCollection = await course();
    const courseInfo = await studCollection.findOne(
        { _id: new ObjectId(id) },
        { projection: { courseInProgress: 1 } }
    );
    let courseList = [];
    if (courseInfo) {
        const course = courseInfo.courseInProgress;
        for (let i = 0; i < course.length; i++) {
            const courseInfo = await courseCollection.findOne({
                _id: new ObjectId(course[i]),
            });
            courseList.push(courseInfo);
        }
        return courseList;
    }
};

const getStudentCompletedCourse = async (id) => {
    if (!id) throw "Must provide an id to search for";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0)
        throw "Id cannot be an empty string or just spaces";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "invalid object ID";
    const studCollection = await student();
    const courseCollection = await course();
    const courseInfo = await studCollection.findOne(
        { _id: new ObjectId(id) },
        { projection: { courseCompleted: 1 } }
    );
    let courseList = [];
    if (courseInfo) {
        const course = courseInfo.courseCompleted;
        for (let i = 0; i < course.length; i++) {
            const courseInfo = await courseCollection.findOne({
                _id: new ObjectId(course[i]),
            });
            courseList.push(courseInfo);
        }
        return courseList;
    }
};

const getFacultyCurrentCourse = async (id) => {
    if (!id) throw "Must provide an id to search for";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0)
        throw "Id cannot be an empty string or just spaces";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "invalid object ID";
    const facCollection = await faculty();
    const courseCollection = await course();
    const courseInfo = await facCollection.findOne(
        { _id: new ObjectId(id) },
        { projection: { courseInProgress: 1 } }
    );
    let courseList = [];
    if (courseInfo) {
        const course = courseInfo.courseInProgress;
        for (let i = 0; i < course.length; i++) {
            const courseInfo = await courseCollection.findOne({
                _id: new ObjectId(course[i]),
            });
            courseList.push(courseInfo);
        }
        return courseList;
    }
};

const getFacultyTaughtCourse = async (id) => {
    if (!id) throw "Must provide an id to search for";
    if (typeof id !== "string") throw "Id must be a string";
    if (id.trim().length === 0)
        throw "Id cannot be an empty string or just spaces";
    id = id.trim();
    if (!ObjectId.isValid(id)) throw "invalid object ID";
    const facCollection = await faculty();
    const courseCollection = await course();
    const courseInfo = await facCollection.findOne(
        { _id: new ObjectId(id) },
        { projection: { courseTaught: 1 } }
    );
    let courseList = [];
    if (courseInfo) {
        const course = courseInfo.courseCompleted;
        for (let i = 0; i < course.length; i++) {
            const courseInfo = await courseCollection.findOne({
                _id: new ObjectId(course[i]),
            });
            courseList.push(courseInfo);
        }
        return courseList;
    }
};

const registerCourse = async (studentId, courseId) => {
    if (!studentId || !courseId) throw "Must provide student id and course id";
    if (typeof studentId !== "string" || typeof courseId !== "string")
        throw "Id must be a string";
    if (studentId.trim().length === 0 || courseId.trim().length === 0)
        throw "Id cannot be an empty string or just spaces";
    studentId = studentId.trim();
    courseId = courseId.trim();
    if (!ObjectId.isValid(studentId) || !ObjectId.isValid(courseId))
        throw "invalid object ID";

    const studCollection = await student();
    const studentInfo = await studCollection.findOne(
        { _id: new ObjectId(studentId) },
        { projection: { courseCompleted: 1, courseInProgress: 1 } }
    );
    if (studentInfo === null) throw "invalid student ID";
    const courseCollection = await course();
    const courseInfo = await courseCollection.findOne({
        _id: new ObjectId(courseId),
    });
    if (courseInfo === null) throw "invalid course ID";
    // already enrolled or completed
    if (studentInfo.courseCompleted.includes(courseId)) {
        throw "You have already completed this course";
    }

    if (studentInfo.courseInProgress.includes(courseId)) {
        throw "You have already registered for this course";
    }

    // add course to student's courseInProgress
    const studentUpdate = await studCollection.findOneAndUpdate(
        { _id: new ObjectId(studentId) },
        { $push: { courseInProgress: courseId } }
    );
    if (studentUpdate.lastErrorObject.n === 0) {
        throw "could not update student info successfully";
    }
    // add student to course's studentList
    const courseUpdate = await courseCollection.findOneAndUpdate(
        { _id: new ObjectId(courseId) },
        { $push: { studentlist: studentId } }
    );
    if (courseUpdate.lastErrorObject.n === 0) {
        throw "could not update course info successfully";
    }
    return { Register: "success" };
};

export default {
    createCourse,
    getAll,
    getCourseByCID,
    getCourseByCWID,
    getCourseByStudentEmail,
    getCourseByFacultyEmail,
    getCourseByObjectID,
    getStudentCurrentCourse,
    getStudentCompletedCourse,
    getFacultyCurrentCourse,
    getFacultyTaughtCourse,
    registerCourse,
};
