import { Router } from "express";
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

//ok
router.route("/").get((req, res) => {
  return res.render("admin/admin");
});

//ok
router.route("/faculty").get(async (req, res) => {
  const faculties = await userFunc.allFaculty();
  return res.render("admin/faculty", { faculties: faculties });
});

//ok
router.route("/student").get(async (req, res) => {
  const students = await userFunc.allStudent();
  return res.render("admin/student", { students: students });
});

//ok
router.route("/course").get(async (req, res) => {
  try {
    const allCourses = await coursesFunc.getAll();
    return res.render("admin/course", {
      allCourses: allCourses,
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router
  .route("/register")
  //ok
  .get((req, res) => {
    res.render("admin/register", {title: "Register Page"});
  })
  // check
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
        res.status(400).render("admin/register", {
          error: "Passwords do not match",
          title: "Register Page",
        });
      }

      result = await userFunc.createUser(
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.emailAddressInput,
        req.body.genderInput,
        req.body.birthDateInput,
        req.body.passwordInput,
        req.body.majorInput,
        "faculty"
      );
      if (result) {
        return res.redirect("/admin/faculty");
      } else {
        res.status(500).send("Internal Server Error");
      }
    } catch (e) { }
  });

router
  //ok
  .route("/createcourse")
  .get(async (req, res) => {
    let allFacultyGot = await coursesFunc.getAllFaculty();
    return res.render("admin/courseCreate", { allFaculty: allFacultyGot });
  })
  //check
  .post(async (req, res) => {
    let courseTitle = req.body.courseTitle;
    let courseId = req.body.courseId;
    let description = req.body.description;
    let professorObjectId = req.body.facultyInput;

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
  //ok
  .get(async (req, res) => {
    const status = await adminFunc.registrationStatus();
    return res.render("admin/openRegister", { status: status });
  })
  //ok
  .post(async (req, res) => {
    await adminFunc.changeStatus();
    return res.redirect("/admin/openregister");
  });

router
  //ok
  .route("/archive")
  .get((req, res) => {
    return res.render("admin/archive");
  })
  // pending
  .post(async (req, res) => { });

export default router;
