import { Router } from "express";
const router = Router();
import path from "path";
import { ObjectId } from "mongodb";
import { assignment } from "../config/mongoCollections.js";
import { gradeFunc } from "../data/index.js";
import { validStr, nonNegInt } from "../helper.js";

// id = courseId, to check student's grade
// only student is allowed
router.route("/:id").get(async (req, res) => {
  const courseId = req.params.id;
  const role = req.session.user.role;
  if (role !== "student") {
    return res.redirect(`/assignment//${courseId}`);
  }
  try {
    const studentId = req.session.user._id;
    const allGrade = await gradeFunc.getAllGrade(courseId, studentId);
    // get course name by id
    const course = "Web Programming";
    let totalScoreGet = 0;
    let totalScore = 0;
    let afterCalTotalScoreGet = 0;
    for (let i = 0; i < allGrade.length; i++) {
      if (allGrade[i].scoreGet !== null) {
        totalScoreGet += Number(allGrade[i].scoreGet);
        totalScore += Number(allGrade[i].score);
      }
    }
    if (totalScore > 0) {
      afterCalTotalScoreGet =
        Math.round((totalScoreGet / totalScore) * 10000) / 100;
    }
    return res.render("grade/grade", {
      course: course,
      allGrade: allGrade,
      totalScore: afterCalTotalScoreGet,
    });
  } catch (e) {
    return res.json({ error: e });
  }
});

//id = submissionId
router.route("/detail/:id").post(async (req, res) => {
  const assignmentId = req.body.assignmentId.trim();
  const id = req.body.submissionId.trim();
  const grade = req.body.score.trim();
  if (
    !validStr(assignmentId) ||
    !validStr(id) ||
    !nonNegInt(grade) ||
    !ObjectId.isValid(assignmentId) ||
    !ObjectId.isValid(id)
  ) {
    return res.json({ error: "Error" });
  }
  let num_grade = Number(grade);
  try {
    const assignmentDetail = await assignment();
    const newSubmissionId = new ObjectId(id);
    var submissionDetail = await assignmentDetail.findOne(
      {
        "submission._id": newSubmissionId,
      },
      { projection: { score: 1, "submission.$": 1 } }
    );
  } catch (e) {
    return res.status(500).json({ error: e });
  }
  if (num_grade > submissionDetail.score) {
    return res.json({ error: "Grade can not exceed total score" });
  }

  try {
    await gradeFunc.grade(id, grade);
    return res.redirect(`/assignment/${assignmentId}/allSubmission`);
  } catch (e) {
    return res.json({ error: e });
  }
});

export default router;
