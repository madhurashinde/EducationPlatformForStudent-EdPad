import { Router } from "express";
const router = Router();
import path from "path";
import { assignmentFunc, submissionFunc, coursesFunc } from "../data/index.js";
import { validStr, validWeblink, nonNegInt, validDueTime } from "../helper.js";

router.get("/:id", async (req, res) => {
  let courseId = req.params.id;
  // if the student/faculty is not in this course, do not let pass
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
      } else {
        return res.redirect("/course");
      }
    }
  }
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
    return res.status(400).json({ error: e });
  }
});

router
  .route("/:id/newAssignment")
  .get(async (req, res) => {
    let id = req.params.id;
    // only the professor of this course is allowed
    const professor = await coursesFunc.getFaculty(id);
    if (req.session.user._id !== professor) {
      return res.redirect(`/assignment/${id}`);
    }

    try {
      return res.render("assignment/newAssignment", { courseId: id });
    } catch (e) {
      return res.json({ error: e });
    }
  })
  .post(async (req, res) => {
    let id = req.params.id;
    // only the professor of this course is allowed
    const professor = await coursesFunc.getFaculty(id);
    if (req.session.user._id !== professor) {
      return res.redirect(`/assignment/${id}`);
    }
    const title = req.body.title.trim();
    const dueDate = req.body.dueDate.trim();
    const dueTime = req.body.dueTime.trim();
    const content = req.body.content.trim();
    const file = req.body.file.trim();
    const score = req.body.score.trim();

    if (
      !validStr(title) ||
      !validStr(dueDate) ||
      !validStr(dueTime) ||
      (!validStr(content) && !validWeblink(file)) ||
      !nonNegInt(score) ||
      !validDueTime(dueDate, dueTime)
    ) {
      return res.json({ error: "Invalid Input" });
    }

    try {
      await assignmentFunc.createAssignment(
        title,
        id,
        dueDate,
        dueTime,
        content,
        file,
        score
      );
      return res.redirect(`/assignment/${id}`);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

router
  .route("/detail/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      // if the student/faculty is not in this course, do not let pass
      if (
        req.session.user.role == "student" ||
        req.session.user.role == "faculty"
      ) {
        const courseId = await assignmentFunc.getCourseId(id);
        const currentCourse = await coursesFunc.getCurrentCourse(
          req.session.user._id
        );
        for (let i = 0; i < currentCourse.length; i++) {
          if (currentCourse[i]._id.toString() === courseId) {
            break;
          } else {
            return res.redirect(`/assignment/${courseId}`);
          }
        }
      }

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
      return res.status(400).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    // only the professor of this course is allowed
    const id = req.params.id;
    const course = await assignmentFunc.getCourseId(id);
    const professor = await coursesFunc.getFaculty(course);
    if (req.session.user._id !== professor) {
      return res.redirect(`/assignment/${id}`);
    }

    try {
      const courseId = (await assignmentFunc.getAssignment(id)).courseId;
      await assignmentFunc.removeAssignment(id);
      return res.redirect(`/assignment/${courseId}`);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

router.route("/detail/:id/newSubmission").post(async (req, res) => {
  // only current student in this course in allowed
  const id = req.params.id;
  const course = await assignmentFunc.getCourseId(id);
  const studentList = await coursesFunc.getStudentList(course);
  for (let i = 0; i < studentList.length; i++) {
    if (studentList[i]._id.toString() === req.session.user._id) {
      break;
    } else {
      return res.redirect(`/assignment/detail/${id}`);
    }
  }

  const submitFile = req.body.file.trim();
  const comment = req.body.comment.trim();
  if (!submitFile || !validWeblink(submitFile)) {
    return res.json({ error: "Not a valid file link" });
  }
  const studentId = req.session.user._id;
  const submit = await submissionFunc.getSubmission(id, studentId);
  if (submit === null) {
    var submission = await submissionFunc.createSubmission(
      id,
      studentId,
      submitFile,
      comment
    );
  } else {
    var submission = await submissionFunc.resubmitSubmission(
      id,
      studentId,
      submitFile,
      comment
    );
  }
  return res.json({ submission: submission });
});

router.route("/:id/allSubmission").get(async (req, res) => {
  const id = req.params.id;
  const course = await assignmentFunc.getCourseId(id);
  const professor = await coursesFunc.getFaculty(course);
  if (req.session.user._id !== professor) {
    return res.redirect(`/assignment/detail/${id}`);
  }

  try {
    const submissionAll = await submissionFunc.getAllSubmission(id);
    const totalScore = submissionAll[0];
    const allSubmission = submissionAll[1];
    return res.render("submission/allSubmission", {
      assignmentId: id,
      totalScore: totalScore,
      allSubmission: allSubmission,
    });
  } catch (e) {
    return res.json({ error: e });
  }
});

export default router;
