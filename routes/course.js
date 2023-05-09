import { Router } from "express";
const router = Router();
import { coursesFunc } from "../data/index.js";
import createSurvey from "../data/survey.js";
import { validId, validStr } from "../helper.js";
import xss from "xss";

//ok
router.get("/", async (req, res) => {
  if (req.session.user.role === "admin") {
    return res.redirect("/admin");
  }
  try {
    const CurrentCourses = await coursesFunc.getCurrentCourse(
      req.session.user._id
    );
    const CompletedCourses = await coursesFunc.getCompletedCourse(
      req.session.user._id
    );
    if (req.session.user.role === "student") {
      return res.render("courses/courses", {
        title: "Student courses",
        CompletedCourses: CompletedCourses,
        CurrentCourses: CurrentCourses,
        student: true,
      });
    } else {
      return res.render("courses/courses", {
        title: "Faculty courses",
        CompletedCourses: CompletedCourses,
        CurrentCourses: CurrentCourses,
        student: false,
      });
    }
  } catch (e) {
    return res.status(500).render("error", { error: `${e}` });
  }
});

//ok
router
  .route("/registercourse")
  .get(async (req, res) => {
    // only students allowed
    if (req.session.user.role !== "student") {
      return res.render("notallowed", { redirectTo: "/course" });
    }
    let getAllCourses = await coursesFunc.getAll();
    return res.render("courses/courseRegister", {
      allCourses: getAllCourses,
    });
  })
  .post(async (req, res) => {
    // only students allowed
    if (req.session.user.role !== "student") {
      return res.redirect("/course");
    }
    let courseRegisteredObjectID = xss(req.body.courseInput);
    let studentObjectID = req.session.user._id;

    try {
      await coursesFunc.registerCourse(
        studentObjectID,
        courseRegisteredObjectID
      );
      return res.redirect("/course");
    } catch (e) {
      let getAllCourses = await coursesFunc.getAll();
      return res.status(400).render("courses/courseRegister", {
        error: e,
        allCourses: getAllCourses,
      });
    }
  });

//ok
router.get("/:id", async (req, res) => {
  // only student/faculty in this course allowed
  let courseId = xss(req.params.id);
  //validation
  try {
    courseId = validId(courseId);
  } catch (e) {
    return res.status(400).render("error", { error: `${e}` });
  }
  if (
    req.session.user.role == "student" ||
    req.session.user.role == "faculty"
  ) {
    const currentCourse = await coursesFunc.getCurrentCourse(
      req.session.user._id
    );

    if (!currentCourse.some((course) => course._id.toString() === courseId)) {
      return res.status(403).render("notallowed", { redirectTo: "/course" });
    }
    // this will not let user to see the completed course when they have no current course.
  }
  try {
    let course = await coursesFunc.getCourseByObjectID(courseId);
    let student = false;
    if (req.session.user.role == "student") {
      student = true;
    }
    return res.render("courses/coursedetail", {
      courseObjectID: course._id,
      courseTitle: course.courseTitle,
      student: student,
    });
  } catch (e) {
    return res.status(400).render("error", { error: `${e}` });
  }
});

//only students are allowed
router
  .route("/:id/survey")
  .get(async (req, res) => {
    let courseId = xss(req.params.id);
    if (req.session.user.role !== "student") {
      return res
        .status(403)
        .render("notallowed", { redirectTo: `/course/${courseId}` });
    }
    //validation
    try {
      courseId = validId(courseId);
    } catch (e) {
      return res.status(400).render("error", { error: `${e}` });
    }

    const studentList = await coursesFunc.getStudentList(courseId);
    if (studentList.length === 0)
      return res.status(403).render("notallowed", {
        redirectTo: "/course",
      });
    for (let i = 0; i < studentList.length; i++) {
      if (studentList[i]._id.toString() === req.session.user._id) {
        break;
      }
      if (i === studentList.length - 1) {
        return res.status(403).render("notallowed", {
          redirectTo: "/course",
        });
      }
    }
    return res.render("courses/survey", {
      courseObjectID: courseId,
    });
  })
  .post(async (req, res) => {
    if (req.session.user.role !== "student") {
      return res
        .status(403)
        .render("notallowed", { redirectTo: `/course/${courseId}` });
    }
    let courseId = xss(req.params.id);
    let user = req.session.user;
    let survey = xss(req.body.surveyInput);

    try {
      survey = validStr(survey);
    } catch (e) {
      return res.render("courses/survey", {
        courseObjectID: courseId,
        error: e,
      });
    }
    try {
      const userWithSurvey = await createSurvey(courseId, user, survey);

      if (userWithSurvey.error) {
        return res
          .status(403)
          .render("notallowed", { redirectTo: `/course/${courseId}` });
      }
      return res.redirect(`/courses/${courseId}`);
    } catch (error) {
      return res.render("courses/survey", {
        courseObjectID: courseId,
        error: error,
      });
    }
  });

export default router;
