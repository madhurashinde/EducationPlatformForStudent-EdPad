import { Router } from "express";
const router = Router();
import path from "path";
import { assignmentFunc, coursesFunc } from "../data/index.js";
import { submissionFunc } from "../data/index.js";

router.route("/:id").post(async (req, res) => {
  // only student in this course allowed
  let assignmentId = req.params.id;
  const courseId = assignmentFunc.getCourseId(assignmentId);
  const studentList = coursesFunc.getStudentList(courseId);
  for (let i = 0; i < studentList.length; i++) {
    if (studentList[i]._id.toString() === req.session.user._id) {
      break;
    } else {
      return res.redirect(`/assignment/detail/${id}`);
    }
  }

  try {
    const id = req.params.id;
    const submitFile = req.body.submitFile;
    let comment = null;
    if (req.body.comment) {
      comment = req.body.comment;
    }
    const submit = await submissionFunc.createSubmission(
      id,
      req.session.user._id,
      submitFile,
      comment
    );
    const submissionId = submit._id;
    return res.redirect(`/submission/detail/${submissionId}`);
  } catch (e) {
    return res.json({ error: e });
  }
});

// router.route("/detail/:id").get(async (req, res) => {
//   const id = req.params.id;
//   const submissionDetail = await submissionFunc.getSubmission(id);
//   const assignmentId = submissionDetail.assignmentId;
//   const assignmentDetail = await assignmentFunc.getAssignment(assignmentId);
//   return res.render("assignment/assignmentDetail", {
//     title: "Assignment Detail",
//     assignment: assignmentDetail,
//     submission: submissionDetail,
//   });
// });

export default router;
