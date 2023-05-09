import { Router } from "express";
import xss from "xss";
const router = Router();
import { adminFunc, coursesFunc, userFunc } from "../data/index.js";
import {
  checkValidMajor,
  checkNameFormat,
  checkEmailAddress,
  validPassword,
  checkBirthDateFormat,
  validGender,
  validStr,
  validId,
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
    return res.status(500).render("error", { error: e });
  }
});

router.route("/student").get(async (req, res) => {
  try {
    const students = await userFunc.allStudent();
    return res.render("admin/student", { students: students });
  } catch (e) {
    return res.status(500).render("error", { error: e });
  }
});

router.route("/course").get(async (req, res) => {
  try {
    const allCourses = await coursesFunc.getAll();
    return res.render("admin/course", {
      allCourses: allCourses,
    });
  } catch (e) {
    return res.status(500).render("error", { error: e });
  }
});

router
  .route("/register")
  .get(async (req, res) => {
    try {
      const allMajors = await adminFunc.getAllMajors();
      return res.render("admin/register", { allMajors: allMajors });
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
  })
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
      if (
        !xss(req.body.firstNameInput) ||
        !xss(req.body.lastNameInput) ||
        !xss(req.body.emailAddressInput) ||
        !xss(req.body.genderInput) ||
        !xss(req.body.birthDateInput) ||
        !xss(req.body.passwordInput) ||
        !xss(req.body.majorInput)
      ) {
        const allMajors = await adminFunc.getAllMajors();
        return res.status(400).render("admin/register", {
          allMajors: allMajors,
          error: "Please fill in all fields",
        });
      }
      if (xss(req.body.passwordInput) !== xss(req.body.confirmPasswordInput)) {
        const allMajors = await adminFunc.getAllMajors();

        return res.status(400).render("admin/register", {
          allMajors: allMajors,
          error: "Passwords do not match",
        });
      }

      const facCollection = await user();
      const fac = await facCollection.findOne({
        emailAddress: xss(req.body.emailAddressInput),
      });
      if (fac) {
        throw "Error: Email address is already been registered";
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
      return res.redirect("/admin/faculty");
    } catch (e) {
      return res.render("admin/register", { error: e });
    }
  });

router
  .route("/createcourse")
  .get(async (req, res) => {
    try {
      let allFacultyGot = await coursesFunc.getAllFaculty();
      return res.render("admin/courseCreate", { allFaculty: allFacultyGot });
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
  })
  .post(async (req, res) => {
    let courseTitle = xss(req.body.courseTitle);
    let courseId = xss(req.body.courseId);
    let description = xss(req.body.description);
    let professorObjectId = xss(req.body.facultyInput);
    try {
      courseTitle = validStr(courseTitle);
      courseId = validId(courseId);
      description = validStr(description);
      professorObjectId = validId(professorObjectId);

      let createdCourse = await coursesFunc.createCourse(
        courseTitle,
        courseId,
        description,
        professorObjectId
      );
      return res.redirect("/admin/course");
    } catch (e) {
      let allFacultyGot = await coursesFunc.getAllFaculty();
      return res.render("admin/courseCreate", {
        allFaculty: allFacultyGot,
        error: e,
      });
    }
  });

router
  .route("/openregister")
  .get(async (req, res) => {
    try {
      const status = await adminFunc.registrationStatus();
      return res.render("admin/openRegister", { status: status });
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
  })
  .post(async (req, res) => {
    try {
      await adminFunc.changeStatus();
      return res.redirect("/admin/openregister");
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
  });

router
  .route("/archive")
  .get((req, res) => {
    return res.render("admin/archive");
  })
  .post(async (req, res) => {
    try {
      await adminFunc.archive();
      return res.redirect("/admin/archive");
    } catch (e) {
      return res.status(500).render("error", { error: e });
    }
  });

export default router;
