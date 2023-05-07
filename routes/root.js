import { Router } from "express";
import xss from 'xss';

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
      checkNameFormat(xss(req.body.firstNameInput));
      checkNameFormat(xss(req.body.lastNameInput));
      checkEmailAddress(xss(req.body.emailAddressInput));
      validGender(xss(req.body.genderInput));
      checkBirthDateFormat(xss(req.body.birthDateInput));
      validPassword(xss(req.body.passwordInput));
      checkValidMajor(xss(req.body.majorInput));
      if (xss(req.body.passwordInput) !== xss(req.body.confirmPasswordInput)) {
        res.status(400).render("register/register", {
          error: "Passwords do not match",
          title: "Register Page",
        });
      }
      const facCollection = await user();
      const fac = await facCollection.findOne({
        emailAddress: xss(req.body.emailAddressInput),
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
        xss(req.body.firstNameInput),
        xss(req.body.lastNameInput),
        xss(req.body.emailAddressInput),
        xss(req.body.genderInput),
        xss(req.body.birthDateInput),
        xss(req.body.passwordInput),
        xss(req.body.majorInput),
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
      checkEmailAddress(xss(req.body.emailAddressInput));
      validPassword(xss(req.body.passwordInput));
    } catch (e) {
      return res.render("error", { error: e, title: "Error" });
    }
    try {
      const result = await userFunc.checkUser(
        xss(req.body.emailAddressInput),
        xss(req.body.passwordInput)
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
