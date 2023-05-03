import { Router } from "express";
const router = Router();

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
