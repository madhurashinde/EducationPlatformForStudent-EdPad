import { Router } from "express";
import xss from "xss";
const router = Router();
import { assignmentFunc, coursesFunc, submissionFunc } from "../data/index.js";
import { validStr, validId } from "../helper.js";

// router.route("/:id").post(async (req, res) => {
//   // only student in this course allowed
//   let id = xss(req.params.id);
//   try {
//     id = validId(id);
//   } catch (e) {
//     return res.status(400).render("error", { error: e });
//   }
//   try {
//     const courseId = await assignmentFunc.getCourseId(id);
//     const studentList = await coursesFunc.getStudentList(courseId);
//     for (let i = 0; i < studentList.length; i++) {
//       if (studentList[i]._id.toString() === req.session.user._id) {
//         break;
//       }
//       if (i === studentList.length - 1) {
//         throw "not in this course";
//       }
//     }
//   } catch (e) {
//     return res.status(403).render("notallowed", {
//       redirectTo: `/assignment/detail/${id}`,
//     });
//   }
//   try {
//     const submitFile = xss(req.body.submitFile);
//     const submit = await submissionFunc.createSubmission(
//       id,
//       req.session.user._id,
//       submitFile
//     );
//     // const submissionId = submit._id;
//     return submit;
//   } catch (e) {
//     return res.render("error", { error: e });
//   }
// });

router.route("/:id/newcomment").post(async (req, res) => {
  // only student in this course allowed
  let id = xss(req.params.id);
  try {
    id = validId(id);
  } catch (e) {
    return res.status(400).render("error", { error: e });
  }
  const courseId = await assignmentFunc.getCourseId(id);
  const studentList = await coursesFunc.getStudentList(courseId);
  for (let i = 0; i < studentList.length; i++) {
    if (studentList[i]._id.toString() === req.session.user._id) {
      break;
    }
    if (i === studentList.length - 1) {
      return res.status(403).render("notallowed", {
        redirectTo: `/assignment/detail/${id}`,
      });
    }
  }

  try {
    const studentId = validId(xss(req.session.user._id));
    const comment = validStr(xss(req.body.comment));
    const submit = await submissionFunc.addComment(id, studentId, comment);
    return res.json({ comment: submit });
  } catch (e) {
    return res.render("error", { error: e });
  }
});

export default router;
