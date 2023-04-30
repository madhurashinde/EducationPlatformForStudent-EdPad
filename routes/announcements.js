import {Router} from 'express';
const router = Router();
import {annsData} from '../data/index.js';
import validation from '../helper.js';
router
  .route('/:courseId')
  .get(async (req, res) => {
    try {
      if(!req.session.user){
        return res.redirect('/login');
      }
      let course = req.params.courseId;
      const annList = await annsData.getAll(course);
      if(!annList){
        throw 'No announcements found'
      }
      if(req.session.user.role=="student"){
        res.render('announcements/allAnnouncements', {annList: annList,student:true});
      } 
      if(req.session.user.role=="faculty"){
        res.render('announcements/allAnnouncements', {annList: annList,faculty:true});
      }
      if(req.session.user.role=="admin"){
        res.render('announcements/allAnnouncements', {annList: annList,admin:true});
      }
    
    } catch (e) {
      res.status(500).json({error: e});
    }
  });

router
  .route('/:courseId/newAnnouncement')
  .get(async (req, res) => {
    if(!req.session.user){
      return res.redirect('/login');
    }
    if(req.session.user){
      if(req.session.user.role=="student"){
        return res.render('error');
      }
      let courseId=req.params.courseId;
      if(req.session.user.role=="feculty"){
        return res.render('announcements/newAnnouncement',{course:courseId});
      }
      // if(req.session.user.role=="admin"){
      //   return res.render('announcements/newAnnouncement');
      // }
    }
  } 
  )
  .post(async (req, res) => {
    const anninfo = req.body;
    if (!anninfo || Object.keys(anninfo).length === 0){
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      req.params.courseId = validation.checkId(req.params.courseId, 'Id URL Param');
      if (!anninfo.ann_title|| !anninfo.ann_description) throw 'All fields need to have valid values';
      anninfo.ann_title = validation.checkString(anninfo.ann_title, 'title');
      // anninfo.userId = validation.checkId(anninfo.userId, 'userId');
      // anninfo.description
    } catch (e) {
      return res.status(400).render('announcements/allAnnouncements',{error: e});
    }

    try {
      let title = req.body.ann_title;
      // let user = req.body.userId;
      let course = req.params.courseId;
      let description = req.body.ann_description;
      // let user= req.session.user.firstname;
      let user="user demo"
      
      const newAnn = await annsData.create(title, user, description, course);
      if(!newAnn){
        throw 'Could not post announcement'
      }
      return res.redirect('/announcement');
    } catch (e) {
      res.status(400).render('announcements/allAnnouncements',{error: `${e}`});
    }
  });

router
  .route('/:courseId/:id')
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      res.status(404).render('announcements/allAnnouncements',{error: `${e}`});
    }   
    try {
      if(!req.session.user){
        return res.redirect('/login');
      }
      const ann = await annsData.get(req.params.id);
      let desc=ann.description;
      let user=ann.user;
      let title=ann.title;
      let date=ann.createdAt

      res.render('announcements/announcementDetail',{ title: title,user:user ,description:desc, date:date});
    } catch (e) {
      res.status(404).render('announcements/allAnnouncements',{error: `${e}`});
    }
  })
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
  router
  .route(':courseId/delete/:id')
  .get(async (req, res) => {
    //code here for DELETE
    try {
      req.params.id = validation.checkId(req.params.id, 'Id URL Param');
    } catch (e) {
      res.status(404).render('announcements/allAnnouncements',{error: `${e}`});
    }
    try {
      let Ann=await annsData.get(req.params.id);
      if(!Ann){
        throw 'Announcement not found'
      }
    }catch(e){
      res.status(404).render('announcements/allAnnouncements',{ error: `${e}`})
    }
    try {
      if(!req.session.user){
        return res.redirect('/login');
      }
      if(req.session.user.role=='student'){
        return res.render('error');
      }
      let deletedAnn = await annsData.remove(req.params.id);
      const annList = await annsData.getAll();
      if(deletedAnn){              
        res.render('announcements/allAnnouncements', {annList: annList,faculty:true, message:"Deleted Announcement"});  
      }else{
        res.render('announcements/allAnnouncements', {annList: annList,faculty:true, message:"Could not delete Announcement"});
      }
    } catch (e) {
      res.status(404).render('announcements/allAnnouncements',{ error: `${e}`})
    }
  })
export default router;