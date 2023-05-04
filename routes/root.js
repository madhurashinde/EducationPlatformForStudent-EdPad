import { Router } from "express";
const router = Router();
import { facultyFunc, adminFunc, studFunc } from "../data/index.js";
import { checkEmailAddress, validPassword } from "../helper.js";

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
          firstName: result_fac.firstName,
          lastName: result_fac.lastName,
          emailAddress: result_fac.emailAddress,
          courseTaught: result_fac.courseTaught,
          role: result_fac.role,
        };
        if (req.session.user.role === "faculty") {
          return res.redirect("/faculty");
        }
      }
    } catch (e) {}

    // student login
    try {
      const result_stud = await studFunc.checkStudent(
        req.body.emailAddressInput,
        req.body.passwordInput
      );
      if (result_stud) {
        req.session.user = {
          firstName: result_stud.firstName,
          lastName: result_stud.lastName,
          emailAddress: result_stud.emailAddress,
          courseInProgress: result_stud.courseInProgress,
          courseCompleted: result_stud.courseCompleted,
          role: result_stud.role,
        };
        return res.redirect("/course");
      }
    } catch (e) {}

    // admin login
    try {
      const result_admin = await adminFunc.checkAdmin(
        req.body.emailAddressInput,
        req.body.passwordInput
      );
      // console.log(result,'result');
      if (result_admin) {
        req.session.user = {
          firstName: result_admin.firstName,
          lastName: result_admin.lastName,
          role: result_admin.role,
        };
        return res.redirect("/admin");
      }
    } catch (e) {}
    return res.render("login/login", {
      error: "Either the email or the password is not valid",
      title: "Login Page",
    });
  });

router.route("/faculty").get(async (req, res) => {
  //code here for GET
  // console.log('protected riyte');
  // return res.render("homepage", {
  //   firstName: req.session.user.firstName,
  //   lastName: req.session.user.lastName,
  //   courseTaught: req.session.user.courseTaught,
  //   title: "Faculty Page",
  // });
  return res.json({ sucess: "success" });
});

router.route("/student").get(async (req, res) => {
  //code here for GET
  // console.log('protected riyte');
  return res.render("student", {
    firstName: req.session.user.firstName,
    lastName: req.session.user.lastName,
    courseCompleted: req.session.user.courseCompleted,
    courseInProgress: req.session.user.courseInProgress,
    title: "Student Page",
  });
});

router.route("/admin").get(async (req, res) => {
  //code here for GET
  // console.log('protected riyte');
  return res.render("admin", {
    firstName: req.session.user.firstName,
    lastName: req.session.user.lastName,
    title: "Admin Page",
  });
});

export default router;
