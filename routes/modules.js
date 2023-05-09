import { Router } from "express";
import xss from "xss";
import express from "express";
const router = Router();
import { coursesFunc, modulesData } from "../data/index.js";
import { validId, validStr } from "../helper.js";

//ok
router.route("/:courseId").get(async (req, res) => {
  // if the student/faculty is not in this course, do not let pass
  let course = xss(req.params.courseId);
  if (
    req.session.user.role == "student" ||
    req.session.user.role == "faculty"
  ) {
    const currentCourse = await coursesFunc.getCurrentCourse(
      req.session.user._id
    );
    for (let i = 0; i < currentCourse.length; i++) {
      if (currentCourse[i]._id.toString() === course) {
        break;
      }
      if (i === currentCourse.length - 1) {
        return res.status(403).render("notallowed", { redirectTo: "/course" });
      }
    }
  }

  try {
    const moduleList = await modulesData.getAll(course);
    if (req.session.user.role == "faculty") {
      res.render("modules/allModules", {
        moduleList: moduleList,
        faculty: true,
        courseId: course,
      });
    } else {
      res.render("modules/allModules", {
        moduleList: moduleList,
        faculty: false,
        courseId: course,
      });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//ok
router.route("/:courseId/newModule").get(async (req, res) => {
  // only the professor of this course is allowed
  let courseId = xss(req.params.courseId);
  const professor = await coursesFunc.getFaculty(courseId);
  if (req.session.user._id !== professor) {
    return res.redirect(`/module/${courseId}`);
  }
  return res.render("modules/newModule", { course: courseId });
});

// ok
router
  .route("/detail/:id")
  .get(async (req, res) => {
    // if the student/faculty is not in this course, do not let pass
    const id = xss(req.params.id);
    if (
      req.session.user.role == "student" ||
      req.session.user.role == "faculty"
    ) {
      try {
        const courseId = await modulesData.getCourseId(id);
        const currentCourse = await coursesFunc.getCurrentCourse(
          req.session.user._id
        );
        for (let i = 0; i < currentCourse.length; i++) {
          if (currentCourse[i]._id.toString() === courseId) {
            break;
          }
          if (i === currentCourse.length - 1) {
            return res.status(403).render("notallowed", {
              redirectTo: `/module/${courseId}`,
            });
          }
        }
      } catch (e) {
        return res.status(404).render("error", {
          error: "Page Not Found",
        });
      }
    }

    try {
      const mod = await modulesData.get(id);
      res.render("modules/moduleDetail", {
        title: mod.title,
        description: mod.description,
        fileURL: mod.fileURL,
        course: mod.courseId,
      });
    } catch (e) {
      res.status(404).render("modules/allModules", { error: `${e}` });
    }
  })
  .delete(async (req, res) => {
    // only the professor of this course is allowed
    let modId = xss(req.params.id);
    const course = await modulesData.getCourseId(modId);
    const professor = await coursesFunc.getFaculty(course);
    if (req.session.user._id !== professor) {
      return res.redirect(`/module/${course}`);
    }

    const id = validId(modId);
    const module = await modulesData.get(id);
    const courseId = module.courseId;
    try {
      let deletedMod = await modulesData.remove(id);
      if (deletedMod) {
        res.redirect(`/module/${courseId}`);
      }
    } catch (e) {
      res.status(404).redirect(`/module/${courseId}`);
    }
  });

export default router;
