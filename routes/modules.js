import { Router } from "express";
const router = Router();
import { modulesData } from "../data/index.js";
import validation from "../helper.js";
router.route("/:courseId").get(async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    let course = req.params.courseId;
    const moduleList = await modulesData.getAll(course);
    if (!moduleList) {
      throw "No modules found";
    }
    if (req.session.user){
    if (req.session.user.role == "student") {
      res.render("modules/allModules", {
        moduleList: moduleList,
        student: true,
        courseId:course
      });
    }
    if (req.session.user.role == "faculty") {
      res.render("modules/allModules", {
        moduleList: moduleList,
        faculty: true,
        courseId:course
      });
    }
    if (req.session.user.role == "admin") {
      res.render("modules/allModules", { moduleList: moduleList, admin: true ,courseId:course});
    }
  }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router
  .route("/:courseId/newModule")
  .get(async (req, res) => {
    try {
      req.params.courseId = validation.checkId(req.params.courseId, "Id URL Param");
      
    } catch (e) {
      res.status(404).render("modules/allModules", { error: `${e}` });
    }
    if (!req.session.user) {
      return res.redirect("/login");
    }
    if (req.session.user) {
      if (req.session.user.role == "student") {
        return res.render('notallowed');
      }
      // if (req.session.user.role == "feculty") {


        let course=req.params.courseId;
        return res.render("modules/newModule",{course:course});
      // }
      // if(req.session.user.role=="admin"){
      //   return res.render('announcements/newAnnouncement');
      // }
    }
  })
  .post(async (req, res) => {
    const moduleinfo = req.body;
    if (!moduleinfo || Object.keys(moduleinfo).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
      req.params.courseId = validation.checkId(
        req.params.courseId,
        "Id URL Param"
      );
      if (!moduleinfo.mod_title || !moduleinfo.mod_description)
        throw "All fields need to have valid values";
      moduleinfo.mod_title = validation.checkString(
        moduleinfo.mod_title,
        "title"
      );
      // anninfo.userId = validation.checkId(anninfo.userId, 'userId');
      // anninfo.description
    } catch (e) {
      return res.status(400).render("modules/newModule",{course:course,error:`${e}`});
    }

    try {
      let title = req.body.mod_title;
      let course = req.params.courseId;
      let description = req.body.mod_description;
      // let user= req.session.user.firstname;
      let user = "user demo";

      const newModule = await modulesData.create(
        title,
        user,
        description,
        course
      );
      if (!newModule) {
        throw "Could not post module";
      }
      return res.redirect("/module");
    } catch (e) {
      res.status(400).render("error", { error: `${e}` });
    }
  });

router.route("/:courseId/:id").get(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "Id URL Param");
    req.params.courseId = validation.checkId(req.params.courseId, "Id URL Param");
    
  } catch (e) {
    res.status(404).render("error", { error: `${e}` });
  }
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    let course= req.params.courseId;

    const mod = await modulesData.get(req.params.id);
    let desc = mod.description;
    let user = mod.user;
    let title = mod.title;

    res.render("modules/moduleDetail", {
      title: title,
      user: user,
      description: desc,
      date: date,
      course:course

    });
  } catch (e) {
    res.status(404).render("modules/allModules", { error: `${e}` });
  }
});

router.route("/:courseId/delete/:id").get(async (req, res) => {
  //code here for DELETE
  try {
    req.params.id = validation.checkId(req.params.id, "Id URL Param");
  } catch (e) {
    res.status(404).render("modules/allModules", { error: `${e}` });
  }
  try {
    let Mod = await modulesData.get(req.params.id);
    if (!Mod) {
      throw "Module not found";
    }
  } catch (e) {
    res.status(404).render("modules/allModules", { error: `${e}` });
  }
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    if (req.session.user.role == "student") {
      return res.render("error");
    }
    let deletedMod = await modulesData.remove(req.params.id);
    const modList = await modulesData.getAll();
    if (deletedMod) {
      res.render("modules/allModules", {
        modList: modList,
        faculty: true,
        message: "Deleted Module",
      });
    } else {
      res.render("modules/allModules", {
        modList: modList,
        faculty: true,
        message: "Could not delete Module",
      });
    }
  } catch (e) {
    res.status(404).render("modules/allModules", { error: `${e}` });
  }
});
export default router;
