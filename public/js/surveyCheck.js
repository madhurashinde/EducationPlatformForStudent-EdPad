let surveyForm = document.getElementById("survey-form");
let surveyInput = document.getElementById("surveyInput");
let errorDiv = document.getElementById("error");

const validStr = (str) => {
    if (!str) throw `Error: You must supply an input!`;
    if (typeof str !== "string") throw `Error: input must be a string!`;
    str = str.trim();
    if (str === "")
      `Error: input cannot be an empty string or string with just spaces`;
    return str;
  };

  if (surveyForm) {
    surveyForm.addEventListener("submit", async (event) => {
      surveyInput.classList.remove("inputClass");
      var survey = surveyInput.value;
      try {
        validStr(survey)
      } catch (e) {
        event.preventDefault();
        const message = typeof e === "string" ? e : e.message;
        errorDivs.textContent = message;
        errorDivs.hidden = false;
        surveyInput.value = survey;
        surveyInput.classList.add("inputClass");
      }
    });
}