let form = document.getElementById("form");
let submitFile = document.getElementById("submitFile");
let errorDiv = document.getElementById("error");

if (form) {
  form.addEventListener("submit", async (event) => {
    submitFile.classList.remove("inputClass");
    errorDiv.hidden = true;

    const web = /^www\..+\.com$/;
    if (
      !submitFile ||
      !submitFile.value.trim() ||
      !web.test(submitFile.value.trim())
    ) {
      event.preventDefault();
      errorDiv.hidden = false;
      submitFile.classList.add("inputClass");
      submitFile.value = "";
      submitFile.focus();
    }
  });
}
