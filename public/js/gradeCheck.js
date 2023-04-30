let forms = document.getElementsByClassName("grade");
let scores = document.getElementsByClassName("score");
let errorDivs = document.getElementsByClassName("error");
let totalScore = document.getElementById("totalScore");
totalScore = totalScore.innerHTML.trim();
totalScore = parseInt(totalScore);

for (let i = 0; i < forms.length; i++) {
  forms[i].addEventListener("submit", async (event) => {
    for (let j = 0; j < forms.length; j++) {
      scores[j].classList.remove("inputClass");
      errorDivs[j].hidden = true;
    }

    let scoreNum = scores[i].value;
    if (!scoreNum) {
      event.preventDefault();
      errorDivs[i].hidden = false;
      scores[i].classList.add("inputClass");
      scores[i].value = "";
      scores[i].focus();
    } else {
      scoreNum = scoreNum.trim();
      scoreNum = parseInt(scoreNum);
      console.log(scoreNum, totalScore);
      console.log(scoreNum > totalScore);
      if (scoreNum === NaN || scoreNum < 0 || scoreNum > totalScore) {
        event.preventDefault();
        errorDivs[i].hidden = false;
        scores[i].classList.add("inputClass");
        scores[i].value = "";
        scores[i].focus();
      }
    }
  });
}
