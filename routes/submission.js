import { Router } from "express";
const router = Router();
import path from "path";
import { assignmentFunc } from "../data/index.js";
import { submissionFunc } from "../data/index.js";

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      return res.render("submission/submissionDetail", { assignmentId: id });
    } catch (e) {
      return res.json({ error: e });
    }
  })
  .post(async (req, res) => {
    try {
      const id = req.params.id;
      const submitFile = req.body.submitFile;
      let comment = null;
      if (req.body.comment) {
        comment = req.body.comment;
      }
      console.log("post");
      const submit = await submissionFunc.createSubmission(
        id,
        "643895a8b3ee41b54432b776",
        submitFile,
        comment
      );
      console.log("submitted");
      console.log(submit);
      const submissionId = submit._id;
      return res.redirect(`/submission/detail/${submissionId}`);
    } catch (e) {
      return res.json({ error: e });
    }
  });

router.route("/detail/:id").get(async (req, res) => {
  const id = req.params.id;
  const submissionDetail = await submissionFunc.getSubmission(id);
  const assignmentId = submissionDetail.assignmentId;
  const assignmentDetail = await assignmentFunc.getAssignment(assignmentId);
  return res.render("assignment/assignmentDetail", {
    title: "Assignment Detail",
    assignment: assignmentDetail,
    submission: submissionDetail,
  });
});

export default router;
