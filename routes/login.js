import { Router } from "express";
const router = Router();
import path from "path";
import { facultyFunc, adminFunc, studFunc } from "../data/index.js";
import { checkEmailAddress, validPassword } from "../helper.js";

router
  .route("/")
  .get(async (req, res) => {
    try {
      // console.log("reaching here")
      // req.method = 'POST'
      // res.send("login page")
      // return res.render('login', {title: "Login Page"});
      return res.render("login/login", {
        title: "Login Page",
      });
      // return res.redirect("/login");
    } catch (error) {
      return res.render("error");
    }
  })
  .post(async (req, res) => {
    // console.log('aala ithe to kadhich');
    try {
      checkEmailAddress(req.body.emailAddressInput);
      // console.log(req.body.emailAddressInput)
      validPassword(req.body.passwordInput);

      // facluty login
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

      // student login
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
        };
        return res.redirect("/student");
      }

      // admin login
      const result_admin = await adminFunc.checkAdmin(
        req.body.emailAddressInput,
        req.body.passwordInput
      );
      // console.log(result,'result');
      if (result_admin) {
        req.session.user = {
          firstName: result_admin.firstName,
          lastName: result_admin.lastName,
        };
        return res.redirect("/admin");
      } else {
        res.render("login/login", {
          error: "Either the email or the password is not valid",
          title: "Login Page",
        });
      }
    } catch (e) {
      res.render("login/login", { error: e, title: "Login Page" });
      return;
    }
  });

export default router;
