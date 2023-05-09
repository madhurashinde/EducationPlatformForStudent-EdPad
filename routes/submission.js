import { Router } from "express";
import xss from 'xss';
const router = Router();
import { assignmentFunc, coursesFunc, submissionFunc } from "../data/index.js";
import { validStr, validId } from "../helper.js";

router.route("/:id").post(async (req, res) => {
  // only student in this course allowed
  let assignmentId = xss(req.params.id);
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
    const id = xss(req.params.id);
    const submitFile = xss(req.body.submitFile);
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
  let assignmentId = xss(req.params.id);
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
    const id = validId(xss(req.params.id));
    const studentId = validId(xss(req.session.user._id));
    const comment = validStr(xss(req.body.comment));
    const submit = await submissionFunc.addComment(id, studentId, comment);
    return res.json({ comment: submit });
  } catch (e) {
    return res.json({ error: e });
  }
});

export default router;
