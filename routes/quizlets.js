import { Router } from "express";
import xss from "xss";
const router = Router();
import axios from "axios";

router
  .route("/")
  .get(async (req, res) => {   
    let data1 = await axios.get(
      `https://opentdb.com/api.php?amount=15&type=multiple&category=9`
    );

    let output = data1.data.results;

    return res.render("quizlets", { data: output });
  })
  .post(async (req, res) => {
    try {
      let categoryIdInput;
      if (xss(req.body)) {
        categoryIdInput = xss(req.body.quizletCategoryInput);
      }

      if (!/^(9|10|19|20|21|22|23|24|25|27|28|30)$/.test(categoryIdInput)) {
        throw "Error: Invalid category";
      }

      let categorydata = await axios.get(
        `https://opentdb.com/api.php?amount=15&category=${categoryIdInput}&type=multiple`
      );
      // .then(res=>console.log(res))
      if (!categorydata) {
        throw "Could not get data";
      }

      let output = categorydata.data.results;
      // code for displaying shuffled options with the questions

      // function shuffle(array) {
      //     const newArray = [...array]
      //     const length = newArray.length

      //     for (let start = 0; start < length; start++) {
      //       const randomPosition = Math.floor((newArray.length - start) * Math.random())
      //       const randomItem = newArray.splice(randomPosition, 1)

      //       newArray.push(...randomItem)
      //     }

      //     return newArray
      //   }
      // for(let i in output){
      //     let answerChoices=[];
      //     answerChoices=[...output[i].incorrect_answers];
      //     answerChoices.push(output[i].correct_answer);
      //     let newArr=shuffle(answerChoices);
      //     console.log(newArr);

      //     output[i].choices = newArr;
      // }

      return res.render("quizlets", { data: output });
    } catch (e) {
      return res.status(400).render("quizlets", { error: `${e}` });
    }
    //     try{

    //     }catch(e){
    //         // return res.redirect("")
    //     }
  });

export default router;
