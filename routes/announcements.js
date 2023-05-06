import { Router } from "express";
const router = Router();
import { annsData } from "../data/index.js";
import { validStr, validId } from "../helper.js";

router.route("/:courseId").get(async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    let course = req.params.courseId;
    const annList = await annsData.getAll(course);

    if (req.session.user.role == "student") {
      res.render("announcements/allAnnouncements", {
        courseId: course,
        annList: annList,
        student: true,
      });
    }
    if (req.session.user.role == "faculty") {
      res.render("announcements/allAnnouncements", {
        courseId: course,
        annList: annList,
        faculty: true,
      });
    }
    if (req.session.user.role == "admin") {
      res.render("announcements/allAnnouncements", {
        courseId: course,
        annList: annList,
        admin: true,
      });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router
  .route("/:courseId/newAnnouncement")
  .get(async (req, res) => {
    if (!req.session.user || !req.session.user.role) {
      return res.redirect("/login");
    } else {
      let courseId = req.params.courseId;
      if (req.session.user.role) {
        if (req.session.user.role == "faculty") {
          const annList = await annsData.getAll(req.params.courseId);
          return res.render(`announcements/newAnnouncement`, {course: courseId, annList:annList});
        } else {
          return res.redirect(`/announcement/${courseId}`);
        }
      }
    }
  })
  .post(async (req, res) => {
    const anninfo = req.body;
    if (!anninfo || Object.keys(anninfo).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }
    try {
      req.params.courseId = validId(
        req.params.courseId
      );
      if (!anninfo.ann_title || !anninfo.ann_description)
        throw "All fields need to have valid values";
      anninfo.ann_title = validStr(anninfo.ann_title);
      
      // anninfo.userId = validation.checkId(anninfo.userId, 'userId');
      // anninfo.description
    } catch (e) {
      const annList = await annsData.getAll(course);
      return res
        .status(400)
        .render("announcements/allAnnouncements", { annList: annList,error: e });
    }

    try {
      let title = req.body.ann_title;
      // let user = req.body.userId;
      let course = req.params.courseId;
      let description = req.body.ann_description;
      // let user= req.session.user.firstname;
     

      const newAnn = await annsData.create(title, description, course);
      console.log(newAnn);
      if (!newAnn) {
        throw "Could not post announcement";
      }
      return res.redirect(`/announcement/${course}`);
    } catch (e) {
      res
        .status(400)
        .render("announcements/allAnnouncements", {annList: annList,error: `${e}` });
    }
  });

router.route("/detail/:id").get(async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.role) {
      return res.redirect("/login");
    }
    const ann = await annsData.get(req.params.id);
    res.render("announcements/announcementDetail", {
      title: ann.title,
      description: ann.description,
      date: ann.createdAt,
      course: ann.courseId,
    });
  } catch (e) {
    const annList = await annsData.getAll(course);
    res.status(404).render("announcements/allAnnouncements", {annList:annList, error: `${e}` });
  }
});
// .delete(async (req, res) => {
//   //code here for DELETE
//   try {
//     // req.params.id = validation.checkId(req.params.id, 'Id URL Param');
//   } catch (e) {
//     res.status(404).render('allAnnouncements',{error: `${e}`});
//   }
//   try {
//     let Ann=await annsData.get(req.params.id);
//     if(!Ann){
//       throw 'Announcement not found'
//     }
//   }catch(e){
//     res.status(404).render('allAnnouncements',{ error: `${e}`})
//   }
//   try {
//     let deletedAnn = await annsData.remove(req.params.id);
//     if(deletedAnn){
//     res.render('allAnnouncements',{message:"Deleted"});}
//     else{
//       throw 'Could not delete announcement'
//     }
//   } catch (e) {
//     res.status(404).render('allAnnouncements',{ error: `${e}`})
//   }
// })
router.route("/:courseId/delete/:id").get(async (req, res) => {
  //code here for DELETE
  try {
    req.params.id = validId(req.params.id);
    req.params.courseId = validId(req.params.courseId)
  } catch (e) {
    const annList = await annsData.getAll(course);
    res.status(404).render("announcements/allAnnouncements", {annList:annList,courseId:req.params.courseId, error: `${e}` });
  }
  try {
    let Ann = await annsData.get(req.params.id);
    if (!Ann) {
      throw "Announcement not found";
    }
  } catch (e) {
    const annList = await annsData.getAll(course);
    res.status(404).render("announcements/allAnnouncements", {annList:annList,courseId:req.params.courseId, error: `${e}` });
  }
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    if (req.session.user.role == "student") {
      return res.render("error");
    }
    let deletedAnn = await annsData.remove(req.params.id);
    const annList = await annsData.getAll(req.params.courseId);
    if (deletedAnn) {
      res.render("announcements/allAnnouncements", {
        annList: annList,
        faculty: true,
        courseId:req.params.courseId,
        message: "Deleted Announcement",
      });
    } else {
      res.render("announcements/allAnnouncements", {
        annList: annList,
        faculty: true,
        courseId:req.params.courseId,
        message: "Could not delete Announcement",
      });
    }
  } catch (e) {
    const annList = await annsData.getAll(course);
    res.status(404).render("announcements/allAnnouncements", {annList:annList,courseId:req.params.courseId, error: `${e}` });
  }
});
export default router;
