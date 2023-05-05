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
  validRole
} from "../helper.js";
import {user} from '../config/mongoCollections.js';
router
  .route("/admin/register")
  .get(async (req, res) => {
    console.log("get route")
    res.render('register/registerAdmin', {title: "Register Page"});
  })
  .post(async (req, res) => {
    console.log("route");
    let result = {};
    try {
      checkNameFormat(req.body.firstNameInput);
      checkNameFormat(req.body.lastNameInput);
      // CWID = validCWID(CWID);
      checkEmailAddress(req.body.emailAddressInput);
      validGender(req.body.genderInput);
      checkBirthDateFormat(req.body.birthDateInput);
      validPassword(req.body.passwordInput);
      checkValidMajor(req.body.majorInput);
      validRole(req.body.roleInput)
      if(req.body.passwordInput !== req.body.confirmPasswordInput){
        res.status(400).render('register/registerAdmin',{error: "Passwords do not match", title: "Register Page"});
      }
      
      result = await userFunc.createUser(req.body.firstNameInput, req.body.lastNameInput,req.body.emailAddressInput,req.body.genderInput, req.body.birthDateInput, req.body.passwordInput,req.body.majorInput, req.body.roleInput );
      if(result.insertedUser){
        return res.redirect('/login')
      }
      else {
        res.status(500).send("Internal Server Error")
      }

      result = await facultyFunc.createFaculty(
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.emailAddressInput,
        req.body.genderInput,
        req.body.birthDateInput,
        req.body.passwordInput,
        req.body.majorInput
      );
      if (result.insertedUser) {
        return res.redirect("/login");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (e) {
      res
        .status(400)
        .render("register/register", { error: e, title: "Register Page" });
      return;
    }
  });
router
  .route("/register")
  .get(async (req, res) => {
    res.render("register/register", { title: "Register Page" });
  })
  .post(async (req, res) => {
    let result = {};
    try {
      checkNameFormat(req.body.firstNameInput);
      checkNameFormat(req.body.lastNameInput);
      checkEmailAddress(req.body.emailAddressInput);
      validGender(req.body.genderInput);
      checkBirthDateFormat(req.body.birthDateInput);
      validPassword(req.body.passwordInput);
      checkValidMajor(req.body.majorInput);
      validRole(req.body.roleInput)
      if(req.body.passwordInput !== req.body.confirmPasswordInput){
        res.status(400).render('register/register',{error: "Passwords do not match", title: "Register Page"});
      }
      // const facCollection = await user();
      // const fac = await facCollection.findOne({emailAddress: req.body.emailAddressInput})
      // if (fac){
      //   console.log(fac.role)
      //     throw `Error: Email address is registered as a faculty`
      // }
      result = await userFunc.createUser(req.body.firstNameInput, req.body.lastNameInput,req.body.emailAddressInput,req.body.genderInput, req.body.birthDateInput, req.body.passwordInput,req.body.majorInput, req.body.roleInput );
      if(result){
        return res.redirect('/login')
      }
      result = await studFunc.createStudent(
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.emailAddressInput,
        req.body.genderInput,
        req.body.birthDateInput,
        req.body.passwordInput,
        req.body.majorInput
      );
      if (result.insertedUser) {
        return res.redirect("/login");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (e) {
      // console.log("Error: ",e);
      res
        .status(400)
        .render("register/register", { error: e, title: "Register Page" });
      return;
    }
  });

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
      return res.render("error", { error: e, title: "Error" });
    }

    // user login
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

router.route("/admin").get(async (req, res) => {
  try {
    const allCourses = await coursesFunc.getAll();
    return res.render("courses/courseAdmin", {
      title: "All courses",
      allCourses: allCourses,
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router
  .route("/admin/register")
  .get((req, res) => {
    res.render("register/register", { title: "Register Page" });
  })
  .post(async (req, res) => {
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

      result = await facultyFunc.createFaculty(
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.emailAddressInput,
        req.body.genderInput,
        req.body.genderInput,
        req.body.passwordInput,
        req.body.majorInput
      );
      if (result.insertedUser) {
        return res.redirect("/login");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (e) {
      // console.log("Error: ",e);
      res
        .status(400)
        .render("register/register", { error: e, title: "Register Page" });
      return;
    }
  });

router
  .route("/admin/createcourse")
  .get(async (req, res) => {
    return res.render("courses/courseCreate");
  })
  .post(async (req, res) => {
    let courseTitle = req.body.courseTitle;
    let courseId = req.body.courseId;
    let description = req.body.description;
    let professorId = req.body.professorId;
    let professorName = req.body.professorName;
    // let courseMajor = req.body.courseMajor;

    //validation for the same course

    try {
      let createdCourse = await coursesFunc.createCourse(
        courseTitle,
        courseId,
        description,
        professorId,
        professorName
      );
      return res.redirect("/course/admin");
    } catch (e) {
      res.status(400).json({ error: "having error" });
    }
  });

router
  .route("/register")
  .get((req, res) => {
    res.render("register/register", { title: "Register Page" });
  })
  .post(async (req, res) => {
    let result = {};
    try {
      checkNameFormat(req.body.firstNameInput);
      checkNameFormat(req.body.lastNameInput);
      // CWID = validCWID(CWID);
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
      const userCollection = await user();

      const userInfo = await userCollection.findOne({
        emailAddress: req.body.emailAddressInput.trim().toLowerCase(),
      });
      if (fac) {
        throw `Error: Email address has an associated account`;
      }
      result = await studFunc.createStudent(
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.emailAddressInput,
        req.body.genderInput,
        req.body.genderInput,
        req.body.passwordInput,
        req.body.majorInput
      );
      if (result.insertedUser) {
        return res.redirect("/login");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (e) {
      // console.log("Error: ",e);
      res
        .status(400)
        .render("register/register", { error: e, title: "Register Page" });
      return;
    }
  });

router.route("/logout").get((req, res) => {
  req.session.destroy();
  res.render("login/logout", { title: "Logout Page" });
});
export default router;
