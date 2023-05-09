import express from "express";
import multer from "multer";
import path from "path";
import xss from "xss";

import { coursesFunc, submissionFunc } from "./data/index.js";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");

import { assignmentFunc, modulesData } from "./data/index.js";
import {
  validDate,
  validId,
  validStr,
  validTime,
  nonNegInt,
} from "./helper.js";

app.use("/public", staticDir);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Middleware
app.use(
  session({
    name: "AuthCookie",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
  })
);

app.all("/", async (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.role === "admin") {
      return res.redirect("/admin");
    } else {
      return res.redirect("/course");
    }
  } else {
    return res.redirect("/login");
  }
  next();
});

app.use("/admin", async (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
});

app.use("/course", async (req, res, next) => {
  if (!req.session.user || !req.session.user.role) {
    return res.redirect("/login");
  }
  next();
});

app.use("/announcement", async (req, res, next) => {
  if (!req.session.user || !req.session.user.role) {
    return res.redirect("/login");
  }
  next();
});

app.use("/module", async (req, res, next) => {
  if (!req.session.user || !req.session.user.role) {
    return res.redirect("/login");
  }
  next();
});

app.use("/assignment", async (req, res, next) => {
  if (!req.session.user || !req.session.user.role) {
    return res.redirect("/login");
  }
  next();
});

app.use("/grade", async (req, res, next) => {
  if (!req.session.user || !req.session.user.role) {
    return res.redirect("/login");
  }
  next();
});

app.use("/people", async (req, res, next) => {
  if (!req.session.user || !req.session.user.role) {
    return res.redirect("/login");
  }
  next();
});

app.use("/assignment/:id", async (req, res, next) => {
  if (req.method == "POST") {
    if (req.body.method == "delete") {
      req.method = "DELETE";
    }
  }
  next();
});

app.use("/announcement/detail/:id", async (req, res, next) => {
  if (req.method == "POST") {
    if (req.body.method == "delete") {
      req.method = "DELETE";
    }
  }
  next();
});

app.use("/module/detail/:id", async (req, res, next) => {
  if (req.method == "POST") {
    if (req.body.method == "delete") {
      req.method = "DELETE";
    }
  }
  next();
});

// upload and download file
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif|pdf|txt|doc/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: File type not supported!");
  }
  console.log("check file type:" + file.name, file);
}

//module
// only the professor of this course is allowed
app.post("/module/new", (req, res) => {
  const storage = multer.diskStorage({
    destination: "./public/uploads/module",
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Max file size: 10MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).single("mod_file");

  upload(req, res, async (err) => {
    try {
      var title = validStr(xss(req.body.mod_title));
      var description = validStr(xss(req.body.mod_description));
      var mod_file = validStr(xss(req.file.filename));
      var courseId = validId(xss(req.body.courseId));
      if (!title || !description || !courseId || !mod_file)
        throw "All fields need to have valid values";
    } catch (e) {}
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      if (req.file == undefined) {
        return res.status(400).json({ msg: "Error: No file selected!" });
      } else {
        try {
          const professor = await coursesFunc.getFaculty(courseId);
          if (professor !== req.session.user._id) {
            return res.redirect(`/module/${courseId}`);
          }
          await modulesData.create(title, description, mod_file, courseId);
          return res.redirect(`/module/${courseId}`);
        } catch (e) {}
      }
    }
  });
});

app.get("/module/download/:filename", (req, res) => {
  const fileName = xss(req.params.filename);
  const filePath = path.join(
    __dirname,
    "public",
    "uploads",
    "module",
    fileName
  );
  res.download(filePath, fileName, (err) => {
    if (err) {
      res.status(404).json({ message: "File not found" });
    }
  });
});

// assignment
// only the professor of this course is allowed
app.post("/assignment/new", (req, res) => {
  const storage = multer.diskStorage({
    destination: "./public/uploads/assignment",
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Max file size: 10MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).single("file");

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      if (req.file == undefined) {
        return res.status(400).json({ msg: "Error: No file selected!" });
      } else {
        try {
          const id = validId(xss(req.body.courseId));
          const title = validStr(xss(req.body.title));
          const dueDate = validDate(xss(req.body.dueDate));
          const dueTime = validTime(xss(req.body.dueTime));
          const content = xss(req.body.content).trim();
          const file = req.file.filename;
          if (!validStr(content) && !validStr(file))
            throw "must provide instruction of the assignment by text or file";
          const score = nonNegInt(xss(req.body.score));
          const professor = await coursesFunc.getFaculty(id);
          console.log(professor, req.session.user._id);
          if (professor !== req.session.user._id) {
            return res.redirect(`/assignment/${id}`);
          }

          await assignmentFunc.createAssignment(
            title,
            id,
            dueDate,
            dueTime,
            content,
            file,
            score.toString()
          );
          return res.redirect(`/assignment/${id}`);
        } catch (e) {}
      }
    }
  });
});

app.get("/assignment/download/:filename", (req, res) => {
  const fileName = xss(req.params.filename);
  const filePath = path.join(
    __dirname,
    "public",
    "uploads",
    "assignment",
    fileName
  );
  res.download(filePath, fileName, (err) => {
    if (err) {
      res.status(404).json({ message: "File not found" });
    }
  });
});

// submission
// only current student in this course in allowed
app.post("/submission/:id/new", (req, res) => {
  const assignmentId = xss(req.params.id);
  const storage = multer.diskStorage({
    destination: "./public/uploads/submission",
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Max file size: 10MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).single("submitFile");

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    } else {
      if (req.file == undefined) {
        console.log("file undefined...");
        return res.status(400).json({ msg: "Error: No file selected!" });
      } else {
        const submitFile = req.file.filename;
        const studentId = req.session.user._id;
        let submission = await submissionFunc.createSubmission(
          assignmentId,
          studentId,
          submitFile
        );
        return res.json({ submission: submission });
      }
    }
  });
});

app.get("/submission/download/:filename", (req, res) => {
  const fileName = xss(req.params.filename);
  const filePath = path.join(
    __dirname,
    "public",
    "uploads",
    "submission",
    fileName
  );
  res.download(filePath, fileName, (err) => {
    if (err) {
      res.status(404).json({ message: "File not found" });
    }
  });
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
