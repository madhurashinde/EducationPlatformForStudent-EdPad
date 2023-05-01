import { Router } from "express";
const router = Router();
import path from "path";
import { facultyFunc, adminFunc, studFunc } from "../data/index.js";
import  { checkEmailAddress, validPassword}  from "../helper.js";

router
    .route("/")
    .get(async (req, res) => {
      res.redirect('/login')
    })
    .post(async (req, res) => {
    });

  router
    .route('/login')
    .get(async (req, res) => {
      try {
        // console.log("reaching here")
        // req.method = 'POST'
        // res.send("login page")
        // return res.render('login', {title: "Login Page"});
        return res.render("login", {
          title: "Login Page"
              });
      // return res.redirect("/login");
      } catch (error) {
        // console.log(error)
      }
      //code here for GET
     
      
    })
    .post(async (req, res) => {
      //code here for POST
      // console.log('aala ithe to kadhich');
      let result;
      try{
        checkEmailAddress(req.body.emailAddressInput);
        // console.log(req.body.emailAddressInput)
        validPassword(req.body.passwordInput);

        result_fac = await facultyFunc.checkFaculty(req.body.emailAddressInput,req.body.passwordInput);
        result_stud = await studFunc.checkStudent(req.body.emailAddressInput,req.body.passwordInput);
        result_admin = await adminFunc.checkAdmin(req.body.emailAddressInput,req.body.passwordInput);
        // console.log(result,'result');
        if(result_fac){
          // console.log("here1")
          req.session.user = {firstName: result_fac.firstName, lastName: result_fac.lastName, emailAddress: result_fac.emailAddress, courseTaught: result_fac.courseTaught, role: result_fac.role};
          if(req.session.user.role === 'faculty'){
            return res.redirect('/faculty')
          }
        }
        else if(result_stud){
          req.session.user ={firstName: result_stud.firstName, lastName: result_stud.lastName, emailAddress: result_stud.emailAddress, courseInProgress: result_stud.courseInProgress, courseCompleted: result_stud.courseCompleted }
          return res.redirect('/student')
        }
        else{
          req.session.user ={firstName: result_admin.firstName, lastName: result_admin.lastName};
          return res.redirect('/admin')
        }
        
      }catch(e){
        // console.log("Error: ",e);
        res.status(400).render('login',{error: e, title: "Login Page"});
        return;
      }
      
    
  
    });
    router.route('/faculty').get(async (req, res) => {
      //code here for GET
      // console.log('protected riyte');
       return res.render('faculty',{firstName: req.session.user.firstName, lastName:req.session.user.lastName, courseTaught: req.session.user.courseTaught, title: "Faculty Page"})
    });

    router.route('/student').get(async (req, res) => {
      //code here for GET
      // console.log('protected riyte');
       return res.render('student',{firstName: req.session.user.firstName, lastName:req.session.user.lastName, courseCompleted: req.session.user.courseCompleted, courseInProgress: req.session.user.courseInProgress, title: "Student Page"})
    });

    router.route('/admin').get(async (req, res) => {
      //code here for GET
      // console.log('protected riyte');
       return res.render('admin',{firstName: req.session.user.firstName, lastName:req.session.user.lastName, title: "Admin Page"})
    });
  