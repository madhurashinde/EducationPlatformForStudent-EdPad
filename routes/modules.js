import { Router } from "express";
const router = Router();
import { modulesData } from "../data/index.js";
import { validId, validStr } from "../helper.js";

//ok
router.route("/:courseId").get(async (req, res) => {
  if (!req.session.user || !req.session.user.role) {
    return res.redirect("/login");
  }
  try {
    let course = req.params.courseId;
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
router
  .route("/:courseId/newModule")
  .get((req, res) => {
    if (!req.session.user || !req.session.user.role) {
      return res.redirect("/login");
    } else {
      const courseId = req.params.courseId;
      if (!req.session.user.role == "faculty") {
        return res.redirect(`/module/${courseId}`);
      } else {
        return res.render("modules/newModule", { course: courseId });
      }
    }
  })
  .post(async (req, res) => {
    const moduleinfo = req.body;
    if (!moduleinfo || Object.keys(moduleinfo).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    const courseId = validId(req.params.courseId);
    try {
      if (!moduleinfo.mod_title || !moduleinfo.mod_description)
        throw "All fields need to have valid values";
      moduleinfo.mod_title = validStr(moduleinfo.mod_title);
    } catch (e) {
      return res
        .status(400)
        .render("modules/newModule", { course: courseId, error: `${e}` });
    }

    try {
      let title = req.body.mod_title;
      let course = req.params.courseId;
      let description = req.body.mod_description;
      let user = "www.userdemo.com";
      const newModule = await modulesData.create(
        title,
        description,
        user,
        course
      );
      return res.redirect(`/module/${course}`);
    } catch (e) {
      res.status(400).render("error", { error: e });
    }
  });

// ok
router
  .route("/detail/:id")
  .get(async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect("/login");
      }
      const mod = await modulesData.get(req.params.id);
      res.render("modules/moduleDetail", {
        title: mod.title,
        description: mod.description,
        fileURL: mod.fileURL,
        course: mod.courseId,
      });
    } catch (e) {
      res.status(404).render("modules/allModules", { error: e });
    }
  })
  .delete(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const id = validId(req.params.id);
    const module = await modulesData.get(id);
    const courseId = module.courseId;
    if (req.session.user.role == "student") {
      return res.redirect(`/module/${courseId}`);
    }
    try {
      let Mod = await modulesData.get(req.params.id);
      let deletedMod = await modulesData.remove(id);
      if (deletedMod) {
        res.redirect(`/module/${courseId}`);
      }
    } catch (e) {
      res.status(404).redirect(`/module/${courseId}`);
    }
  });

export default router;
