import { Router } from "express";
const router = Router();
import path from "path";
import { gradeFunc } from "../data/index.js";
import { validStr, nonNegInt } from "../../helper/js";

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

router
  .route("/:id")
  .post(async (req, res) => {
    const assignmentId = req.body.assignmentId.trim();
    const id = req.body.submissionId.trim();
    const grade = req.body.score.trim();
    // if (
    //   !validStr(assignmentId) ||
    //   !validStr(id) ||
    //   !nonNegInt(grade) ||
    //   !ObjectId.isValid(assignmentId) ||
    //   !ObjectId.isValid(id)
    // ) {
    //   res.json({ error: "Error" });
    // }
    // grade = Number(grade);
    // try {
    //   const assignmentDetail = await assignment();
    //   const newSubmissionId = new ObjectId(submissionId);
    //   let submissionDetail = await assignmentDetail.findOne(
    //     {
    //       "submission._id": newSubmissionId,
    //     },
    //     { projection: { score: 1, "submission.$": 1 } }
    //   );
    // } catch (e) {
    //   res.status(500).json({ error: e });
    // }
    // if (grade > submissionDetail.score) {
    //   res.json({ error: "Grade can not exceed total score" });
    // }

    try {
      await gradeFunc.grade(id, grade);
      return res.redirect(`/assignment/${assignmentId}/allSubmission`);
    } catch (e) {
      res.json({ error: e });
    }
  })
  .patch(async (req, res) => {});

export default router;
