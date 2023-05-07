import { Router } from "express";
const router = Router();
import { coursesFunc } from "../data/index.js";
import createSurvey from "../data/survey.js";

//ok
router.get("/", async (req, res) => {
  if (req.session.user) {
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
      return res.status(500).json({ error: e });
    }
  }
});

//ok
router
  .route("/registercourse")
  .get(async (req, res) => {
    // only students allowed
    if (req.session.user.role !== "student") {
      return res.redirect("/course");
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
    let courseRegisteredObjectID = req.body.courseInput;
    let studentObjectID = req.session.user._id;

    try {
      await coursesFunc.registerCourse(
        studentObjectID,
        courseRegisteredObjectID
      );
      return res.redirect("/course");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

//ok
router.get("/:id", async (req, res) => {
  // only student/faculty in this course allowed
  let courseId = req.params.id;
  if (
    req.session.user.role == "student" ||
    req.session.user.role == "faculty"
  ) {
    const currentCourse = await coursesFunc.getCurrentCourse(
      req.session.user._id
    );

    if (!currentCourse.some((course) => course._id.toString() === courseId)) {
      return res.render("not allowed");
    }
    // this will not let user to see the completed course when they have no current course.
  }
  try {
    let course = await coursesFunc.getCourseByObjectID(courseId);
    return res.render("courses/coursedetail", {
      courseObjectID: course._id,
      courseTitle: course.courseTitle,
    });
  } catch (e) {
    return res.status(400).json({ error: `${e}` });
  }
});

router
  .route("/:id/survey")
  .get(async (req, res) => {
    const courseId = req.params.id;
    let course = await coursesFunc.getCourseByObjectID(courseId);
    return res.render("courses/survey", {
      courseObjectID: course._id,
    });
  })
  .post(async (req, res) => {
    try {
      const courseId = req.params.id;
      let user = req.session.user;
      let survey = req.body.surveyInput;
      const userWithSurvey = await createSurvey(courseId, user, survey);
      let course = await coursesFunc.getCourseByObjectID(courseId);
      return res.render("courses/coursedetail", {
        courseObjectID: course._id,
        courseTitle: course.courseTitle,
      });
    } catch (error) {
      return res.render("courses/survey", {
        error: error,
        title: "Survey Form",
      });
    }
  });

export default router;
