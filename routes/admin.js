import { Router } from "express";
const router = Router();
import { adminFunc, coursesFunc, userFunc } from "../data/index.js";

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
    return res.render("admin/register");
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
        res.status(400).render("register/registerAdmin", {
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
        return res.redirect("/admin");
      } else {
        return res.status(500).send("Internal Server Error");
      }
    } catch (e) {}
  });

router
  .route("/createcourse")
  .get((req, res) => {
    return res.render("admin/courseCreate");
  })
  //check
  .post(async (req, res) => {
    let courseTitle = req.body.courseTitle;
    let courseId = req.body.courseId;
    let description = req.body.description;
    let professorId = req.body.professorId;
    let professorName = req.body.professorName;

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
