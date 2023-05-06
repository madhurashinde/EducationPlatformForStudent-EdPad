import RootRoutes from "./root.js";
import AdminRoutes from "./admin.js";
import PeopleRoutes from "./people.js";
import QuizletRoutes from "./quizlets.js";
import CourseRoutes from "./course.js";
import ModuleRoutes from "./modules.js";
import AnnouncementRoutes from "./announcements.js";
import AssignmentRoutes from "./assignment.js";
import SubmissionRoutes from "./submission.js";
import GradeRoutes from "./grade.js";

const constructorMethod = (app) => {
  app.use("/", RootRoutes);
  app.use("/admin", AdminRoutes);
  app.use("/people", PeopleRoutes);
  app.use("/course", CourseRoutes);
  app.use("/assignment", AssignmentRoutes);
  app.use("/submission", SubmissionRoutes);
  app.use("/grade", GradeRoutes);
  app.use("/announcement", AnnouncementRoutes);
  app.use("/module", ModuleRoutes);
  app.use("/quizlet", QuizletRoutes);

  app.use("*", (req, res) => {
    res.status(404);
  });
};

export default constructorMethod;
