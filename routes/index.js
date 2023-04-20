//Here you will require route files and export them as used in previous labs.
import CourseRoutes from "./course.js";
import AssignmentRoutes from "./assignment.js";
import SubmissionRoutes from "./submission.js";
import GradeRoutes from "./grade.js";

const constructorMethod = (app) => {
  app.use("/course", CourseRoutes);
  app.use("/assignment", AssignmentRoutes);
  app.use("/submission", SubmissionRoutes);
  app.use("/grade", GradeRoutes);

  app.use("*", (req, res) => {
    res.status(404);
  });
};

export default constructorMethod;
