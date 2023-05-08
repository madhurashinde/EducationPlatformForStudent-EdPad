import { course, user, registration } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { validId, validStr } from "../helper.js";

const createCourse = async (
  courseTitle,
  courseCID,
  description,
  professorId
) => {
  courseTitle = validStr(courseTitle);
  courseCID = validStr(courseCID);
  description = validStr(description);
  professorId = validId(professorId);
  const userCollection = await user();
  const faculty = await userCollection.findOne({
    _id: new ObjectId(professorId),
  });
  if (!faculty) throw "Invalid profession Id";

  let newCourse = {
    courseTitle: courseTitle,
    courseCID: courseCID,
    description: description,
    professorId: professorId,
    professorName: faculty.firstName + " " + faculty.lastName,
    major: faculty.major,
    studentlist: [],
  };

  const courseCollection = await course();
  // if course exist?
  const insertInfo = await courseCollection.insertOne(newCourse);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add newCourse";

  const updateFac = await userCollection.findOneAndUpdate(
    {
      _id: new ObjectId(professorId),
    },
    { $push: { courseInProgress: insertInfo.insertedId.toString() } }
  );
  if (updateFac.lastErrorObject.n === 0) {
    throw "could not update faculty profile successfully";
  }

  const newId = insertInfo.insertedId.toString();
  const courseDetail = await getCourseByObjectID(newId);
  return courseDetail;
};

const getAll = async () => {
  const courseCollection = await course();
  let allCourse = await courseCollection.find().toArray();
  allCourse = allCourse.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return allCourse;
};

const getCourseByObjectID = async (id) => {
  id = validId(id);
  const courseCollection = await course();
  const courseInfo = await courseCollection.findOne({ _id: new ObjectId(id) });
  if (!courseInfo) {
    throw "course does not exist";
  }
  courseInfo._id = courseInfo._id.toString();
  return courseInfo;
};

const getStudentList = async (courseId) => {
  courseId = validId(courseId);
  const courseCollection = await course();
  const courseInfo = await courseCollection
    .find({ _id: new ObjectId(courseId) }, { projection: { studentlist: 1 } })
    .toArray();
  const student = courseInfo[0].studentlist;
  const userCollection = await user();
  let studentInfo = [];
  for (let i = 0; i < student.length; i++) {
    const info = await userCollection.findOne({
      _id: new ObjectId(student[i]),
    });
    studentInfo.push(info);
  }
  return studentInfo;
};

const getAllFaculty = async () => {
  const userCollection = await user();
  let allFaculty = await userCollection.find({ role: "faculty" }).toArray();
  allFaculty = allFaculty.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return allFaculty;
};

const getFaculty = async (courseId) => {
  courseId = validId(courseId);
  const courseCollection = await course();
  const courseInfo = await courseCollection.findOne(
    { _id: new ObjectId(courseId) },
    { projection: { professorId: 1 } }
  );
  const faculty = courseInfo.professorId;
  return faculty;
};

const getCurrentCourse = async (id) => {
  id = validId(id);
  const userCollection = await user();
  const courseCollection = await course();
  const courseInfo = await userCollection.findOne(
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

const getCompletedCourse = async (id) => {
  id = validId(id);
  const userCollection = await user();
  const courseCollection = await course();
  const courseInfo = await userCollection.findOne(
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

const registerCourse = async (studentId, courseId) => {
  const registrationCollection = await registration();
  const status = await registrationCollection.findOne({});
  if (status.Enableregistration === false) {
    throw "Admin closed registration ";
  }
  studentId = validId(studentId);
  courseId = validId(courseId);

  const userCollection = await user();
  const userInfo = await userCollection.findOne(
    { _id: new ObjectId(studentId) },
    { projection: { courseCompleted: 1, courseInProgress: 1, role: 1 } }
  );
  if (userInfo === null) throw "invalid student ID";
  if (userInfo.role !== "student")
    throw "Only student can register for courses";
  console.log(userInfo);
  if (userInfo.courseInProgress.length === 4)
    throw "You can register for 4 courses at most";
  const courseCollection = await course();
  const courseInfo = await courseCollection.findOne({
    _id: new ObjectId(courseId),
  });
  if (courseInfo === null) throw "invalid course ID";
  if (userInfo.courseCompleted.includes(courseId)) {
    throw "You have already completed this course";
  }
  if (userInfo.courseInProgress.includes(courseId)) {
    throw "You have already registered for this course";
  }

  // add course to student's courseInProgress
  const studentUpdate = await userCollection.findOneAndUpdate(
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
  getCourseByObjectID,
  getCurrentCourse,
  getCompletedCourse,
  registerCourse,
  getStudentList,
  getFaculty,
  getAllFaculty,
};
