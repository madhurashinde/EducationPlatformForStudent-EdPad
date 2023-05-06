import { Router } from "express";
const router = Router();
import { coursesFunc } from "../data/index.js";

//ok
router.get("/:id", async (req, res) => {
  const courseId = req.params.id;
  const students = await coursesFunc.getStudentList(courseId);
  return res.render("courses/people", { students: students });
});

export default router;
