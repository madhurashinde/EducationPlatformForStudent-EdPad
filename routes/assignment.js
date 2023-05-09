import { Router } from "express";
import xss from "xss";
const router = Router();
import { assignmentFunc, submissionFunc, coursesFunc } from "../data/index.js";
import { validId } from "../helper.js";

// if the student/faculty is not in this course, do not let pass
router.get("/:id", async (req, res) => {
  let courseId = xss(req.params.id);
  //authorization
  try {
    const currentCourse = await coursesFunc.getCurrentCourse(
      req.session.user._id
    );
    for (let i = 0; i < currentCourse.length; i++) {
      if (currentCourse[i]._id.toString() === courseId) {
        break;
      }
      if (i === currentCourse.length - 1) {
        return res.render("notallowed", { redirectTo: "/course" });
      }
    }
  } catch (e) {
    return res.status(500).render("error", { error: `${e}` });
  }
  //validation
  try {
    courseId = validId(courseId);
  } catch (e) {
    return res.status(400).render("error", { error: `${e}` });
  }
  //operation
  try {
    const assignmentList = await assignmentFunc.getAllAssignment(courseId);
    const role = req.session.user.role;
    let faculty = false;
    if (role === "faculty") {
      faculty = true;
    }
    return res.render("assignment/assignment", {
      courseId: courseId,
      assignmentList: assignmentList,
      faculty: faculty,
    });
  } catch (e) {
    return res.status(500).redirect("/course");
  }
});

router
  .route("/:id/newAssignment")
  // only the professor of this course is allowed
  .get(async (req, res) => {
    let id = xss(req.params.id);
    try {
      id = validId(id);
    } catch (e) {
      return res.render("error", { error: "Page Not Found" });
    }
    // authorization
    try {
      const professor = await coursesFunc.getFaculty(id);
      if (req.session.user._id !== professor) {
        return res.redener("notallowed", { redirectTo: `/assignment/${id}` });
      }
      return res.render("assignment/newAssignment", { courseId: id });
    } catch (e) {
      return res.status(500).render("error", { error: "Service Error" });
    }
  });

router
  .route("/detail/:id")
  // if the student/faculty is not in this course, do not let pass
  .get(async (req, res) => {
    let id = xss(req.params.id);
    try {
      id = validId(id);
    } catch (e) {
      return res.status(400).render("error", { error: "Page Not Found" });
    }
    //authorization
    try {
      const courseId = await assignmentFunc.getCourseId(id);
      const currentCourse = await coursesFunc.getCurrentCourse(
        req.session.user._id
      );
      for (let i = 0; i < currentCourse.length; i++) {
        if (currentCourse[i]._id.toString() === courseId) {
          break;
        }
        if (i === currentCourse.length - 1) {
          return res.redirect(`/assignment/${courseId}`);
        }
      }
    } catch (e) {
      return res.status(500).render("error", { error: `${e}` });
    }
    try {
      const assignmentDetail = await assignmentFunc.getAssignment(id);
      const role = req.session.user.role;
      let faculty = false;
      let student = false;
      let submission = null;
      if (role === "faculty") {
        faculty = true;
      } else if (role === "student") {
        student = true;
        const studentId = req.session.user._id;
        submission = await submissionFunc.getSubmission(id, studentId);
      }
      return res.render("assignment/assignmentDetail", {
        title: "Assignment Detail",
        assignment: assignmentDetail,
        faculty: faculty,
        student: student,
        submission: submission,
      });
    } catch (e) {
      return res.status(500).render("error", { error: `${e}` });
    }
  })
  // only the professor of this course is allowed
  .delete(async (req, res) => {
    let id = xss(req.params.id);
    try {
      id = validId(id);
    } catch (e) {
      return res.status(400).redirect("/course");
    }
    try {
      const course = await assignmentFunc.getCourseId(id);
      const professor = await coursesFunc.getFaculty(course);
      if (req.session.user._id !== professor) {
        return res.redirect(`/assignment/${id}`);
      }
      const courseId = (await assignmentFunc.getAssignment(id)).courseId;
      await assignmentFunc.removeAssignment(id);
      return res.redirect(`/assignment/${courseId}`);
    } catch (e) {
      return res.status(500).redirect("/course");
    }
  });

router.route("/:id/allSubmission").get(async (req, res) => {
  let id = xss(req.params.id);
  try {
    id = validId(id);
  } catch (e) {
    res.status(400).redirect("/course");
  }
  try {
    const course = await assignmentFunc.getCourseId(id);
    const professor = await coursesFunc.getFaculty(course);
    if (req.session.user._id !== professor) {
      return res.redirect(`/assignment/detail/${id}`);
    }
    const submissionAll = await submissionFunc.getAllSubmission(id);
    const totalScore = submissionAll[0];
    const allSubmission = submissionAll[1];
    return res.render("submission/allSubmission", {
      assignmentId: id,
      totalScore: totalScore,
      allSubmission: allSubmission,
    });
  } catch (e) {
    res.status(500).redirect(`/assignment/detail/${id}`);
  }
});

export default router;
