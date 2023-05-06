import { Router } from "express";
const router = Router();
import { annsData, coursesFunc } from "../data/index.js";
import { validStr, validId } from "../helper.js";

//ok
router.route("/:courseId").get(async (req, res) => {
  // if the student/faculty is not in this course, do not let pass
  let course = req.params.courseId;
  if (
    req.session.user.role == "student" ||
    req.session.user.role == "faculty"
  ) {
    const currentCourse = await coursesFunc.getCurrentCourse(
      req.session.user._id
    );
    for (let i = 0; i < currentCourse.length; i++) {
      console.log(currentCourse[i]._id.toString(), course);
      if (currentCourse[i]._id.toString() === course) {
        break;
      } else {
        return res.redirect("/course");
      }
    }
  }
  try {
    const annList = await annsData.getAll(course);
    if (req.session.user.role == "student") {
      res.render("announcements/allAnnouncements", {
        courseId: course,
        annList: annList,
        faculty: false,
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
        faculty: false,
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
    // only the professor of this course is allowed
    let courseId = req.params.courseId;
    const professor = await coursesFunc.getFaculty(courseId);
    if (req.session.user._id !== professor) {
      return res.redirect(`/announcement/${courseId}`);
    }
    return res.render(`announcements/newAnnouncement`, {
      course: courseId,
    });
  })
  //ok
  .post(async (req, res) => {
    // only the professor of this course is allowed
    const professor = await coursesFunc.getFaculty(courseId);
    if (req.session.user._id !== professor) {
      return res.redirect(`/announcement/${courseId}`);
    }
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
    // if the student/faculty is not in this course, do not let pass
    if (
      req.session.user.role == "student" ||
      req.session.user.role == "faculty"
    ) {
      const id = req.params.id;
      const courseId = annsData.getCourseId(id);
      const currentCourse = await coursesFunc.getCurrentCourse(
        req.session.user._id
      );
      if (!currentCourse.includes(courseId)) {
        return res.redirect(`/announcement/${courseId}`);
      }
    }
    try {
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
    // only the professor of this course is allowed
    const id = validId(req.params.id);
    const announcement = await annsData.get(id);
    const courseId = announcement.courseId;
    const professor = await coursesFunc.getFaculty(courseId);
    if (req.session.user._id !== professor) {
      return res.redirect(`/announcement/detail/${id}`);
    }

    try {
      let deletedAnn = await annsData.remove(req.params.id);
      return res.redirect(`/announcement/${courseId}`);
    } catch (e) {
      return res.status(404).render("error", { e: e });
    }
  });
export default router;
