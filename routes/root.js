import { Router } from "express";

const router = Router();
import { coursesFunc, userFunc } from "../data/index.js";
import {
  checkBirthDateFormat,
  checkNameFormat,
  checkEmailAddress,
  validPassword,
  checkValidMajor,
  validGender,
} from "../helper.js";
import { user } from "../config/mongoCollections.js";

router
  .route("/register")
  // ok
  .get((req, res) => {
    // if one is logged in, do not show this page
    if (req.session.user && req.session.user.role) {
      return res.redirect("/course");
    }
    return res.render("login/register",{title: "Register Page"});
  })
  //check
  .post(async (req, res) => {
    // if one is logged in, do not show this page
    if (req.session.user && req.session.user.role) {
      return res.redirect("/course");
    }
    let result = {};
    try {
      checkNameFormat(req.body.firstNameInput);
      checkNameFormat(req.body.lastNameInput);
      checkEmailAddress(req.body.emailAddressInput);
      validGender(req.body.genderInput);
      checkBirthDateFormat(req.body.birthDateInput);
      validPassword(req.body.passwordInput);
      checkValidMajor(req.body.majorInput);
      if (req.body.passwordInput !== req.body.confirmPasswordInput) {
        res.status(400).render("register/register", {
          error: "Passwords do not match",
          title: "Register Page",
        });
      }
      const facCollection = await user();
      const fac = await facCollection.findOne({
        emailAddress: req.body.emailAddressInput,
      });
      if (fac) {
        if(fac.role === 'faculty')
        throw `Error: Email address is registered as a faculty`;
      }
      if(fac){
        if(fac.role === 'student')
        throw `Error: Email address is already registered as student`;
      }
      result = await userFunc.createUser(
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.emailAddressInput,
        req.body.genderInput,
        req.body.birthDateInput,
        req.body.passwordInput,
        req.body.majorInput,
        "student"
      );
      if (result) {
        return res.redirect("/login");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (e) {
      res.status(400).render("login/register", { error: e });
      return;
    }
  });

router
  .route("/login")
  // ok
  .get((req, res) => {
    // if one is logged in, do not show this page
    if (req.session.user && req.session.user.role) {
      return res.redirect("/course");
    }
    return res.render("login/login", {
      title: "Login Page",
    });
  })
  //check
  .post(async (req, res) => {
    // if one is logged in, do not show this page
    if (req.session.user && req.session.user.role) {
      return res.redirect("/course");
    }
    try {
      checkEmailAddress(req.body.emailAddressInput);
      validPassword(req.body.passwordInput);
    } catch (e) {
      return res.render("error", { error: e, title: "Error" });
    }
    try {
      const result = await userFunc.checkUser(
        req.body.emailAddressInput,
        req.body.passwordInput
      );
      if (result) {
        req.session.user = result;
        if (req.session.user.role === "admin") {
          return res.redirect("/admin");
        } else {
          return res.redirect("/course");
        }
      }
    } catch (e) {
      return res.render("login/login", {
        error: "Either the email or the password is not valid",
        title: "Login Page",
      });
    }
  });
router.route("/logout").get((req, res) => {
  // if one is not logged in, do not show this page
  if (!req.session.user) {
    return res.redirect("/login");
  }
  req.session.destroy();
  res.render("login/logout", { title: "Logout Page" });
});

export default router;
