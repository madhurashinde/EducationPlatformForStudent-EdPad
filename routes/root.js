import { Router } from "express";
const router = Router();
import { facultyFunc, adminFunc, studFunc } from "../data/index.js";
import { checkEmailAddress, validPassword } from "../helper.js";
import { coursesFunc } from "../data/index.js";

router
  .route("/login")
  .get((req, res) => {
    return res.render("login/login", {
      title: "Login Page",
    });
  })
  .post(async (req, res) => {
    try {
      checkEmailAddress(req.body.emailAddressInput);
      validPassword(req.body.passwordInput);
    } catch (e) {
      return res.render("login/login", { error: e, title: "Login Page" });
    }

    // facluty login
    try {
      const result_fac = await facultyFunc.checkFaculty(
        req.body.emailAddressInput,
        req.body.passwordInput
      );
      if (result_fac) {
        req.session.user = {
          id: result_fac._id,
          firstName: result_fac.firstName,
          lastName: result_fac.lastName,
          emailAddress: result_fac.emailAddress,
          courseTaught: result_fac.courseTaught,
          role: result_fac.role,
        };
        // if (req.session.user.role === "faculty") {
        //   return res.redirect("/faculty");
        // }
        return res.redirect("/course");
      }
    } catch (e) { }

    // student login
    try {
      const result_stud = await studFunc.checkStudent(
        req.body.emailAddressInput,
        req.body.passwordInput
      );
      if (result_stud) {
        req.session.user = {
          id: result_stud._id,
          firstName: result_stud.firstName,
          lastName: result_stud.lastName,
          emailAddress: result_stud.emailAddress,
          courseInProgress: result_stud.courseInProgress,
          courseCompleted: result_stud.courseCompleted,
          role: result_stud.role,
        };
        return res.redirect("/course");
      }
    } catch (e) { }

    // admin login
    try {
      const result_admin = await adminFunc.checkAdmin(
        req.body.emailAddressInput,
        req.body.passwordInput
      );
      if (result_admin) {
        req.session.user = {
          id: result_admin._id,
          firstName: result_admin.firstName,
          lastName: result_admin.lastName,
          role: result_admin.role,
        };
        return res.redirect("/course");
      }
    } catch (e) { }
    return res.render("login/login", {
      error: "Either the email or the password is not valid",
      title: "Login Page",
    });
  });

router.route("/admin").get(async (req, res) => {
  try {
    const allCourses = await coursesFunc.getAll();
    let coursesList = [];
    let coursesObj = {};
    for (let i of allCourses) {
      i._id = i._id.toString();
      coursesObj = {
        _id: i._id,
        // "name": i.name,
        courseTitle: i.courseTitle,
        courseId: i.courseId,
        description: i.description,
        professorId: i.professorId,
        professorName: i.professorName,
      };
      coursesList.push(coursesObj);
    }
    return res.render("courses/courses", {
      title: "All courses",
      allCourses: coursesList,
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
