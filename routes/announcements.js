import { Router } from "express";
const router = Router();
import { annsData } from "../data/index.js";
import { validStr, validId } from "../helper.js";

//ok
router.route("/:courseId").get(async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    let course = req.params.courseId;
    const annList = await annsData.getAll(course);
    if (req.session.user.role == "student") {
      res.render("announcements/allAnnouncements", {
        courseId: course,
        annList: annList,
        // student: true,
      });
    }
    if (req.session.user.role == "faculty") {
      res.render("announcements/allAnnouncements", {
        courseId: course,
        annList: annList,
        faculty: true,
      });
    }
    if (req.session.user.role == "admin") {
      res.render("announcements/allAnnouncements", {
        courseId: course,
        annList: annList,
        // admin: true,
      });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router
  .route("/:courseId/newAnnouncement")
  //ok
  .get(async (req, res) => {
    if (!req.session.user || !req.session.user.role) {
      return res.redirect("/login");
    }
    let courseId = req.params.courseId;
    if (req.session.user.role) {
      if (req.session.user.role == "faculty") {
        return res.render(`announcements/newAnnouncement`, {
          course: courseId,
        });
      } else {
        return res.redirect(`/announcement/${courseId}`);
      }
    }
  })
  //ok
  .post(async (req, res) => {
    const anninfo = req.body;
    if (!anninfo || Object.keys(anninfo).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    let courseId = req.params.courseId;
    try {
      req.params.courseId = validId(req.params.courseId);
      if (!anninfo.ann_title || !anninfo.ann_description)
        throw "All fields need to have valid values";
      anninfo.ann_title = validStr(anninfo.ann_title);
    } catch (e) {
      return res.status(400).render(`announcements/newAnnouncement`, {
        course: courseId,
        error: e,
      });
    }
    try {
      let title = req.body.ann_title;
      let course = req.params.courseId;
      let description = req.body.ann_description;
      const newAnn = await annsData.create(title, description, course);
      if (!newAnn) {
        throw "Could not post announcement";
      }
      return res.redirect(`/announcement/${course}`);
    } catch (e) {
      res.status(400).render(`announcements/newAnnouncement`, {
        course: courseId,
        error: e,
      });
    }
  });

router
  .route("/detail/:id")
  //ok
  .get(async (req, res) => {
    try {
      if (!req.session.user || !req.session.user.role) {
        return res.redirect("/login");
      }
      const ann = await annsData.get(req.params.id);
      res.render("announcements/announcementDetail", {
        title: ann.title,
        description: ann.description,
        date: ann.createdAt,
        course: ann.courseId,
        id: ann._id,
      });
    } catch (e) {
      return res.render("error", { e: e });
    }
  })
  //ok
  .delete(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    const id = validId(req.params.id);
    const announcement = await annsData.get(id);
    const courseId = announcement.courseId;
    if (req.session.user.role == "student") {
      return res.redirect(`/announcement/${courseId}`);
    }
    try {
      let deletedAnn = await annsData.remove(req.params.id);
      return res.redirect(`/announcement/${courseId}`);
    } catch (e) {
      return res.status(404).render("error", { e: e });
    }
  });
export default router;
