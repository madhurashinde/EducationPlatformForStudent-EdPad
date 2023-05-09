import { Router } from "express";
import xss from "xss";
const router = Router();
import { annsData, coursesFunc } from "../data/index.js";
import { validStr, validId } from "../helper.js";

// if the student/faculty is not in this course, do not let pass
router.route("/:courseId").get(async (req, res) => {
  let course = xss(req.params.courseId);
  try {
    const currentCourse = await coursesFunc.getCurrentCourse(
      req.session.user._id
    );
    for (let i = 0; i < currentCourse.length; i++) {
      if (currentCourse[i]._id.toString() === course) {
        break;
      }
      if (i === currentCourse.length - 1) return res.redirect("/course");
    }
  } catch (e) {
    return res.status(500).render("error", { error: `${e}` });
  }

  try {
    course = validId(course);
    const annList = await annsData.getAll(course);
    if (
      req.session.user.role == "student" ||
      req.session.user.role == "admin"
    ) {
      return res.render("announcements/allAnnouncements", {
        courseId: course,
        annList: annList,
        faculty: false,
      });
    }
    if (req.session.user.role == "faculty") {
      return res.render("announcements/allAnnouncements", {
        courseId: course,
        annList: annList,
        faculty: true,
      });
    }
  } catch (e) {
    return res.status(500).render("error", { error: `${e}` });
  }
});

router
  .route("/:courseId/newAnnouncement")
  // only the professor of this course is allowed
  .get(async (req, res) => {
    let courseId = xss(req.params.courseId);

    try {
      courseId = validId(courseId);
    } catch (e) {
      return res.status(400).render("error", { error: `${e}` });
    }

    try {
      const professor = await coursesFunc.getFaculty(courseId);
      if (req.session.user._id !== professor) {
        return res.render(`notallowed`);
      }
      return res.render(`announcements/newAnnouncement`, {
        course: courseId,
      });
    } catch (e) {}
  })
  // only the professor of this course is allowed
  .post(async (req, res) => {
    let courseId = xss(req.params.courseId);

    try {
      courseId = validId(courseId);
      const professor = await coursesFunc.getFaculty(courseId);
      if (req.session.user._id !== professor) {
        return res.render("notallowed");
      }
    } catch (e) {
      return res.status(500).render("error", { error: `${e}` });
    }

    try {
      let anntitle = xss(req.body.ann_title);
      let anndesc = xss(req.body.ann_description);
      if (!anntitle || !anndesc) {
        throw "All fields need to have valid values";
      }
      var title = validStr(anntitle);
      var description = validStr(anndesc);
      var course = validId(courseId);
    } catch (e) {
      return res.status(400).render(`announcements/newAnnouncement`, {
        course: courseId,
        error: `${e}`,
      });
    }

    try {
      const newAnn = await annsData.create(title, description, course);
      if (!newAnn) {
        throw "Could not delete announcement";
      }
      return res.redirect(`/announcement/${course}`);
    } catch (e) {
      return res.status(500).render(`announcements/newAnnouncement`, {
        course: courseId,
        error: `${e}`,
      });
    }
  });

router
  .route("/detail/:id")
  // if the student/faculty is not in this course, do not let pass
  .get(async (req, res) => {
    const id = xss(req.params.id);

    try {
      // id = validId(id);
      const courseId = await annsData.getCourseId(id);
      const currentCourse = await coursesFunc.getCurrentCourse(
        req.session.user._id
      );
      for (let i = 0; i < currentCourse.length; i++) {
        if (currentCourse[i]._id.toString() === courseId) {
          break;
        }
        if (i === currentCourse.length - 1) {
          return res.redirect("/course");
        }
      }
    } catch (e) {
      return res.status(500).redirect(`/course`);
    }

    try {
      const ann = await annsData.get(id);
      return res.render("announcements/announcementDetail", {
        title: ann.title,
        description: ann.description,
        date: ann.createdAt,
        course: ann.courseId,
        id: ann._id,
      });
    } catch (e) {
      return res.status(500).render("error", { error: `${e}` });
    }
  })
  // only the professor of this course is allowed
  .delete(async (req, res) => {
    let id = xss(req.params.id);
    //validation
    try {
      id = validId(id);
    } catch (e) {
      return res.status(400).redirect(`/course`);
    }
    // authorization
    let courseId;
    try {
      const announcement = await annsData.get(id);
      courseId = announcement.courseId;
      const professor = await coursesFunc.getFaculty(courseId);
      if (req.session.user._id !== professor) {
        return res.redirect(`/announcement/detail/${id}`);
      }
    } catch (e) {
      return res.status(500).redirect(`/announcement/${courseId}`);
    }

    // operation
    try {
      // let courseId = announcement.courseId;
      let deletedAnn = await annsData.remove(id);
      if (!deletedAnn) {
        throw "could not delete announcement";
      }
      return res.redirect(`/announcement/${courseId}`);
    } catch (e) {
      return res.status(500).render("error", { error: `${e}` });
    }
  });
export default router;
