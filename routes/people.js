import { Router } from "express";
const router = Router();
import { coursesFunc } from "../data/index.js";

//ok
router.get("/:id", async (req, res) => {
  // if the student/faculty is not in this course, do not let pass
  if (
    req.session.user.role == "student" ||
    req.session.user.role == "faculty"
  ) {
    const id = req.params.id;
    const currentCourse = await coursesFunc.getCurrentCourse(
      req.session.user._id
    );
    for (let i = 0; i < currentCourse.length; i++) {
      if (currentCourse[i]._id.toString() === id) {
        break;
      } else {
        return res.redirect("/course");
      }
    }
  }
  const courseId = req.params.id;
  const students = await coursesFunc.getStudentList(courseId);
  return res.render("courses/people", {
    courseId: courseId,
    students: students,
  });
});

export default router;
