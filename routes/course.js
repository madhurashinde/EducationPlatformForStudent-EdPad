import { Router } from "express";
const router = Router();
import { assignmentFunc } from "../data/index.js";
import { validStr, validWeblink, nonNegInt, validDueTime } from "../helper.js";
import { coursesFunc } from "../data/index.js";

//ok
router.get("/", async (req, res) => {
  if (req.session.user) {
    try {
      if (req.session.user.role === "admin") {
        return res.redirect("/admin");
      } else if (req.session.user.role === "student") {
        const StudCurrentCourses = await coursesFunc.getStudentCurrentCourse(
          req.session.user._id
        );
        const StudCompletedCourses =
          await coursesFunc.getStudentCompletedCourse(req.session.user._id);
        return res.render("courses/courses", {
          title: "Student courses",
          CompletedCourses: StudCompletedCourses,
          CurrentCourses: StudCurrentCourses,
          student: true,
        });
      } else if (req.session.user.role === "faculty") {
        const FacCurrentCourses = await coursesFunc.getFacultyCurrentCourse(
          req.session.user._id
        );
        const FacCompletedCourses = await coursesFunc.getStudentCompletedCourse(
          req.session.user._id
        );
        return res.render("courses/courses", {
          title: "Faculty courses",
          CompletedCourses: FacCompletedCourses,
          CurrentCourses: FacCurrentCourses,
          student: false,
        });
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  } else {
    return res.redirect("/login");
  }
});

//ok
router
  .route("/registercourse")
  .get(async (req, res) => {
    let getAllCourses = await coursesFunc.getAll();
    return res.render("courses/courseRegister", {
      allCourses: getAllCourses,
    });
  })
  .post(async (req, res) => {
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
  let id = req.params.id;
  try {
    let course = await coursesFunc.getCourseByObjectID(id);
    return res.render("courses/coursedetail", {
      courseObjectID: id,
      courseTitle: course.courseTitle,
    });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

export default router;
