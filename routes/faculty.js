import { Router } from "express";
const router = Router();
import path from "path";
import { facultyFunc } from "../data/index.js";

router
    .route("/")
    .get(async (req, res) => {
      res.redirect('/login')
    })
    .post(async (req, res) => {
    });

router
    .route("/login")
    .get(async (req, res) => {
        if (req.session.user) {
            return res.redirect('/homepage.html');
          }
          else{
            return res.render('login', {title: "Log-in"});
          }
    })