import { Router } from "express";
const router = Router();
import path from "path";
import { gradeFunc } from "../data/index.js";

router.route("/student/:id").get(async (req, res) => {
  try {
    const courseId = req.params.id;
    // const studentId = req.session.id;
    const allGrade = await gradeFunc.getAllGrade(
      courseId,
      "643895a8b3ee41b54432b774"
    );
    return res.render("grade/grade", { allGrade: allGrade });
  } catch (e) {
    return res.json({ error: e });
  }
});

router.route("/:id").post(async (req, res) => {
  try {
    const assignmentId = req.body.assignmentId;
    const id = req.body.submissionId;
    const grade = req.body.score;
    await gradeFunc.grade(id, grade);
    return res.redirect(`/assignment/${assignmentId}/allSubmission`);
  } catch (e) {
    res.json({ error: e });
  }
});

export default router;
