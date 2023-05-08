import { Router } from "express";
import xss from 'xss';
const router = Router();
import { assignmentFunc, coursesFunc, submissionFunc } from "../data/index.js";
import { validStr, validId } from "../helper.js";

router.route("/:id").post(async (req, res) => {
  // only student in this course allowed
  let assignmentId = req.params.id;
  const courseId = assignmentFunc.getCourseId(assignmentId);
  const studentList = coursesFunc.getStudentList(courseId);
  for (let i = 0; i < studentList.length; i++) {
    if (studentList[i]._id.toString() === req.session.user._id) {
      break;
    }
    if (i === studentList.length - 1) {
      return res.redirect(`/assignment/detail/${id}`);
    }
  }

  try {
    const id = req.params.id;
    const submitFile = req.body.submitFile;
    const submit = await submissionFunc.createSubmission(
      id,
      req.session.user._id,
      submitFile
    );
    const submissionId = submit._id;
    return res.redirect(`/submission/detail/${submissionId}`);
  } catch (e) {
    return res.json({ error: e });
  }
});

router.route("/:id/newcomment").post(async (req, res) => {
  // only student in this course allowed
  let assignmentId = req.params.id;
  const courseId = await assignmentFunc.getCourseId(assignmentId);
  const studentList = await coursesFunc.getStudentList(courseId);
  for (let i = 0; i < studentList.length; i++) {
    if (studentList[i]._id.toString() === req.session.user._id) {
      break;
    }
    if (i === studentList.length - 1) {
      return res.redirect(`/assignment/detail/${id}`);
    }
  }

  try {
    const id = validId(req.params.id);
    const studentId = validId(req.session.user._id);
    const comment = validStr(req.body.comment);
    const submit = await submissionFunc.addComment(id, studentId, comment);
    return res.json({ comment: submit });
  } catch (e) {
    return res.json({ error: e });
  }
});

export default router;
