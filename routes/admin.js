import { Router } from "express";
import xss from 'xss';
const router = Router();
import { adminFunc, coursesFunc, userFunc } from "../data/index.js";
import {
  checkValidMajor,
  checkNameFormat,
  checkEmailAddress,
  validPassword,
  checkBirthDateFormat,
  validGender,
} from "../helper.js";
import { user } from "../config/mongoCollections.js";

router.route("/").get((req, res) => {
  return res.render("admin/admin");
});

router.route("/faculty").get(async (req, res) => {
  try {
    const faculties = await userFunc.allFaculty();
    return res.render("admin/faculty", { faculties: faculties });
  } catch (e) {
    return res.status(500).render("error", { error: `${e}` });
  }
});

router.route("/student").get(async (req, res) => {
  try {
    const students = await userFunc.allStudent();
    return res.render("admin/student", { students: students });
  } catch (e) {
    return res.status(500).render("error", { error: `${e}` });
  }
});

router.route("/course").get(async (req, res) => {
  try {
    const allCourses = await coursesFunc.getAll();
    return res.render("admin/course", {
      allCourses: allCourses,
    });
  } catch (e) {
    return res.status(500).render("error", { error: `${e}` });
  }
});

router
  .route("/register")
  .get((req, res) => {
    return res.render("admin/register", {title: "Register Page"});
  })
  // check
  .post(async (req, res) => {
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
        res.status(400).render("admin/register", {
          error: "Passwords do not match",
          title: "Register Page",
        });
      }
      
      const facCollection = await user();
      const fac = await facCollection.findOne({
        emailAddress: xss(req.body.emailAddressInput),
      });
      if (fac) {
        console.log(fac.role)
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
        "faculty"
      );
      if (result) {
        console.log("inside result")
        return res.redirect("/admin/faculty");
      } else {
        return res.status(500).send("Internal Server Error");
      }
    } catch (e) {
      res.status(400).render('admin/register',{error: e, title: "Register Page"});
      return;
     }
  });

router
  .route("/createcourse")
  .get(async (req, res) => {
    let allFacultyGot = await coursesFunc.getAllFaculty();
    return res.render("admin/courseCreate", { allFaculty: allFacultyGot });
  })
  //check
  .post(async (req, res) => {
    let courseTitle = xss(req.body.courseTitle);
    let courseId = xss(req.body.courseId);
    let description = xss(req.body.description);
    let professorObjectId = xss(req.body.facultyInput);

    //validation for the same course

    try {
      let createdCourse = await coursesFunc.createCourse(
        courseTitle,
        courseId,
        description,
        professorObjectId
      );
      return res.redirect("/admin/course");
    } catch (e) {
      res.status(400).json({ error: "having error" });
    }
  });

router
  .route("/openregister")
  .get(async (req, res) => {
    try {
      const status = await adminFunc.registrationStatus();
      return res.render("admin/openRegister", { status: status });
    } catch (e) {
      res.status(500).render("error", { error: `${e}` });
    }
  })
  .post(async (req, res) => {
    try {
      await adminFunc.changeStatus();
      return res.redirect("/admin/openregister");
    } catch (e) {
      res.status(500).render("error", { error: `${e}` });
    }
  });

router
  .route("/archive")
  .get((req, res) => {
    return res.render("admin/archive");
  })
  //check
  .post(async (req, res) => {
    try {
      await adminFunc.archive();
      return res.redirect("/admin/archive");
    } catch (e) {
      res.status(500).render("error", { error: `${e}` });
    }
  });

export default router;
