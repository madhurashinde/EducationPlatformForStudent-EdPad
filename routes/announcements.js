import { Router } from "express";
const router = Router();
import { annsData, coursesFunc } from "../data/index.js";
import { validStr, validId } from "../helper.js";

// if the student/faculty is not in this course, do not let pass
router.route("/:courseId").get(async (req, res) => {
  let course = req.params.courseId;
  if (
    req.session.user.role == "student" ||
    req.session.user.role == "faculty"
  ) {
    try {
      const currentCourse = await coursesFunc.getCurrentCourse(
        req.session.user._id
      );
      for (let i = 0; i < currentCourse.length; i++) {
        if (currentCourse[i]._id.toString() === course) {
          break;
        } else {
          return res.redirect("/course");
        }
      }
    } catch (e) {
      return res.status(500).render("error", { error: `${e}` });
    }

    try {
      course = validId(course);
      const annList = await annsData.getAll(course);
      if (req.session.user.role == "student") {
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
      if (req.session.user.role == "admin") {
        return res.render("announcements/allAnnouncements", {
          courseId: course,
          annList: annList,
          faculty: false,
        });
      }
    } catch (e) {
      return res.status(500).render("error", { error: `${e}` });
    }
  }
});

router
  .route("/:courseId/newAnnouncement")
  // only the professor of this course is allowed
  .get(async (req, res) => {
    let courseId = req.params.courseId;

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
    let courseId = req.params.courseId;

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
      const anninfo = req.body;
      if (!anninfo || Object.keys(anninfo).length === 0)
        throw "All fields need to have valid values";
      var title = validStr(anninfo.ann_title);
      var description = validStr(anninfo.ann_description);
      var course = validId(anninfo.courseId);
    } catch (e) {
      return res.status(400).render(`announcements/${course}/newAnnouncement`, {
        course: courseId,
        error: `${e}`,
      });
    }

    try {
      const newAnn = await annsData.create(title, description, course);
      return res.redirect(`/announcement/${course}`);
    } catch (e) {
      return res.status(500).render(`announcements/${course}/newAnnouncement`, {
        course: courseId,
        error: `${e}`,
      });
    }
  });

router
  .route("/detail/:id")
  // if the student/faculty is not in this course, do not let pass
  .get(async (req, res) => {
    if (
      req.session.user.role == "student" ||
      req.session.user.role == "faculty"
    ) {
      const id = req.params.id;

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
    }
  })
  // only the professor of this course is allowed
  .delete(async (req, res) => {
    const id = req.params.id;
    //validation
    try {
      id = validId(id);
    } catch (e) {
      return res.status(400).redirect(`/course`);
    }
    // authorization
    try {
      const announcement = await annsData.get(id);
      var courseId = announcement.courseId;
      const professor = await coursesFunc.getFaculty(courseId);
      if (req.session.user._id !== professor) {
        return res.redirect(`/announcement/detail/${id}`);
      }
    } catch (e) {
      return res.status(500).redirect(`/announcement/${courseId}`);
    }

    // operation
    try {
      let deletedAnn = await annsData.remove(id);
      return res.redirect(`/announcement/${courseId}`);
    } catch (e) {
      return res.status(500).render("error", { error: `${e}` });
    }
  });
export default router;
