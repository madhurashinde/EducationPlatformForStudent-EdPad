import { Router } from "express";
import xss from "xss";
const router = Router();
import { ObjectId } from "mongodb";
import { assignment } from "../config/mongoCollections.js";
import {
  coursesFunc,
  gradeFunc,
  submissionFunc,
  userFunc,
} from "../data/index.js";
import { validId, nonNegInt } from "../helper.js";

// id = courseId, to check student's grade
router.route("/:id").get(async (req, res) => {
  // if the student/faculty is not in this course, do not let pass
  let courseId = xss(req.params.id);
  try {
    courseId = validId(courseId);
  } catch (e) {
    return res.render("error", { error: e });
  }

  if (
    req.session.user.role == "student" ||
    req.session.user.role == "faculty"
  ) {
    const currentCourse = await coursesFunc.getCurrentCourse(
      req.session.user._id
    );
    for (let i = 0; i < currentCourse.length; i++) {
      if (currentCourse[i]._id.toString() === courseId) {
        break;
      }
      if (i === currentCourse.length - 1) {
        return res.status(403).render("notallowed", { redirectTo: "/course" });
      }
    }
  }

  try {
    const role = req.session.user.role;
    if (role !== "student") {
      const allStudent = await coursesFunc.getStudentList(courseId);
      return res.render("grade/courseGrade", {
        courseId: courseId,
        allStudent: allStudent,
      });
    } else {
      const studentId = req.session.user._id;
      const allGrade = await gradeFunc.getStudentScore(courseId, studentId);
      let studentName = await userFunc.getNameById(studentId);
      const course = await coursesFunc.getCourseByObjectID(courseId);
      let totalScoreGet = 0;
      let totalScore = 0;
      let afterCalTotalScoreGet = 0;
      const assignment = Object.keys(allGrade);

      for (let i = 0; i < assignment.length; i++) {
        if (typeof allGrade[assignment[i]][4] === "number") {
          totalScoreGet += allGrade[assignment[i]][4];
          totalScore += allGrade[assignment[i]][3];
        }
      }
      if (totalScore > 0) {
        afterCalTotalScoreGet =
          Math.round((totalScoreGet / totalScore) * 10000) / 100;
      }
      return res.render("grade/grade", {
        faculty: false,
        courseId: courseId,
        course: course.courseTitle,
        student: studentName,
        allGrade: allGrade,
        totalScore: afterCalTotalScoreGet,
      });
    }
  } catch (e) {
    return res.render("error", { error: `${e}` });
  }
});

router.route("/detail/:id").post(async (req, res) => {
  // if the student/faculty is not in this course, do not let pass
  let submissionId = xss(req.params.id);
  const course = await submissionFunc.getCourseId(submissionId);
  if (
    req.session.user.role == "student" ||
    req.session.user.role == "faculty"
  ) {
    const currentCourse = await coursesFunc.getCurrentCourse(
      req.session.user._id
    );
    for (let i = 0; i < currentCourse.length; i++) {
      if (currentCourse[i]._id.toString() === course) {
        break;
      }
      if (i === currentCourse.length - 1) {
        return res
          .status(403)
          .render("notallowed", { redirectTo: `grade/${course}` });
      }
    }
  }

  try {
    const assignmentId = validId(xss(req.body.assignmentId));
    const id = validId(xss(req.body.submissionId));
    const grade = nonNegInt(xss(req.body.score));
    const assignmentDetail = await assignment();
    const newSubmissionId = new ObjectId(id);
    var submissionDetail = await assignmentDetail.findOne(
      {
        "submission._id": newSubmissionId,
      },
      { projection: { score: 1, "submission.$": 1 } }
    );

    if (grade > submissionDetail.score) {
      return res.json({ error: "Grade can not exceed total score" });
    }
    await gradeFunc.grade(id, grade.toString());
    return res.redirect(`/assignment/${assignmentId}/allSubmission`);
  } catch (e) {
    return res.render("error", { error: `${e}` });
  }
});

router.route("/:courseId/:studentId").get(async (req, res) => {
  // only faculty of this course and admin allowed
  let courseId = xss(req.params.courseId);
  const professor = await coursesFunc.getFaculty(courseId);
  if (req.session.user._id !== professor && req.session.user.role !== "admin") {
    return res
      .status(403)
      .render("notallowed", { redirectTo: `/grade/${courseId}` });
  }

  try {
    const studentId = xss(req.params.studentId);
    const courseId = xss(req.params.courseId);
    const allGrade = await gradeFunc.getStudentScore(courseId, studentId);
    let studentName = await userFunc.getNameById(studentId);
    const course = await coursesFunc.getCourseByObjectID(courseId);
    let totalScoreGet = 0;
    let totalScore = 0;
    let afterCalTotalScoreGet = 0;
    const assignment = Object.keys(allGrade);

    for (let i = 0; i < assignment.length; i++) {
      if (typeof allGrade[assignment[i]][3] === "number") {
        totalScoreGet += allGrade[assignment[i]][4];
        totalScore += allGrade[assignment[i]][3];
      }
    }
    if (totalScore > 0) {
      afterCalTotalScoreGet =
        Math.round((totalScoreGet / totalScore) * 10000) / 100;
    }
    return res.render("grade/grade", {
      faculty: true,
      courseId: courseId,
      course: course.courseTitle,
      student: studentName,
      allGrade: allGrade,
      totalScore: afterCalTotalScoreGet,
    });
  } catch (e) {
    return res.render("error", { error: `${e}` });
  }
});

export default router;
