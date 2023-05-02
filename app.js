import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");
import { dbConnection, closeConnection } from "./config/mongoConnection.js";

import { coursesFunc } from "./data/index.js";


app.use("/public", staticDir);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Middleware
// if the course is not in the faculty/students' registered list, don't pass

app.use("/assignment/:id", async (req, res, next) => {
  if (req.method == "POST") {
    if (req.body.method == "delete") {
      req.method = "DELETE";
    }
  }
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

//test for the courses
async function main() {
  const db = await dbConnection();

  let courseTitle = "Introduction to JavaScript3";
  let courseId = "JS101";
  let description = "Learn the basics of JavaScript programming language";
  let professorId = "PROF001";
  let professorName = "John Smith";

  try {
    const newCourse = await coursesFunc.createCourse(
      courseTitle,
      courseId,
      description,
      professorId,
      professorName
    );
    console.log(newCourse);
  } catch (e) {
    console.log(e);
  }
  // console.log(newCourse);

  await closeConnection();
  console.log("over");
}

// main()
