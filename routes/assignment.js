import { Router } from "express";
const router = Router();
import path from "path";
import { ObjectId } from "mongodb";
import { assignmentFunc, submissionFunc } from "../data/index.js";
import { validStr, validWeblink, nonNegInt, validDueTime } from "../helper.js";
import submission from "../data/submission.js";

// id = courseId
// all assignment
router.get("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const assignmentList = await assignmentFunc.getAllAssignment(courseId);
    const role = req.session.user.role;
    let faculty = false;
    if (role === "faculty") {
      faculty = true;
    }
    return res.render("assignment/assignment", {
      title: "All Assignment",
      courseId: courseId,
      assignmentList: assignmentList,
      faculty: faculty,
    });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
});

// id = courseId
// create new assignment, only faculty is allowed
router
  .route("/:id/newAssignment")
  .get(async (req, res) => {
    if (req.session.user.role !== "faculty") {
      return res.redirect(`/assignment/${id}`);
    }
    try {
      const id = req.params.id;
      return res.render("assignment/newAssignment", { courseId: id });
    } catch (e) {
      return res.json({ error: e });
    }
  })
  .post(async (req, res) => {
    if (req.session.user.role !== "faculty") {
      return res.redirect(`/assignment/${id}`);
    }
    const courseId = req.params.id;
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
        courseId,
        dueDate,
        dueTime,
        content,
        file,
        score
      );
      return res.redirect(`/assignment/${courseId}`);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

// id = assignmentId
// assignment detail
router
  .route("/detail/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      const assignmentDetail = await assignmentFunc.getAssignment(id);
      const role = req.session.user.role;
      let faculty = false;
      let submission = null;
      if (role === "faculty") {
        faculty = true;
      } else if (role === "student") {
        const studentId = req.session.user.id;
        submission = await submissionFunc.getSubmission(id, studentId);
      }
      return res.render("assignment/assignmentDetail", {
        title: "Assignment Detail",
        assignment: assignmentDetail,
        faculty: faculty,
        submission: submission,
      });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  })
  // only faculty is allowed
  .delete(async (req, res) => {
    const id = req.params.id;
    if (req.session.user.role !== "faculty") {
      return res.redirect(`/assignment/detail/${id}`);
    }
    try {
      const courseId = (await assignmentFunc.getAssignment(id)).courseId;
      await assignmentFunc.removeAssignment(id);
      return res.redirect(`/assignment/${courseId}`);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

// id = assignmentId
// submit assignment, only student is allowed
router.route("/detail/:id/newSubmission").post(async (req, res) => {
  const id = req.params.id;
  if (req.session.user.role !== "student") {
    return res.redirect(`/assignment/detail/${id}`);
  }
  const submitFile = req.body.file.trim();
  const comment = req.body.comment.trim();
  if (!submitFile || !validWeblink(submitFile)) {
    return res.json({ error: "Not a valid file link" });
  }
  const studentId = req.session.user.id;
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

// id = assignmentId
// grade all submissions, only faculty is allowed
router.route("/:id/allSubmission").get(async (req, res) => {
  if (req.session.user.role !== "faculty") {
    return res.redirect(`/assignment/detail/${id}`);
  }
  const id = req.params.id;
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
