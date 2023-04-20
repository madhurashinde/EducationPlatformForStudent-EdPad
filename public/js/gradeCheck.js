let form = document.getElementById("grade");
let score = document.getElementById("score");
let errorDiv = document.getElementById("error");
let totalScore = document.getElementById("totalScore");
totalScore = totalScore.innerHTML.trim();
totalScore = parseInt(totalScore);

if (form) {
  form.addEventListener("submit", async (event) => {
    score.classList.remove("inputClass");
    errorDiv.hidden = true;

    let scoreNum = score.value;
    if (!scoreNum) {
      event.preventDefault();
      errorDiv.hidden = false;
      score.classList.add("inputClass");
      score.value = "";
      score.focus();
    } else {
      scoreNum = scoreNum.trim();
      scoreNum = parseInt(scoreNum);
      console.log(scoreNum, totalScore);
      console.log(scoreNum > totalScore);
      if (scoreNum === NaN || scoreNum < 0 || scoreNum > totalScore) {
        event.preventDefault();
        errorDiv.hidden = false;
        score.classList.add("inputClass");
        score.value = "";
        score.focus();
      }
    }
  });
}
