let form = document.getElementById("form");
let title = document.getElementById("title");
let dueDate = document.getElementById("dueDate");
let content = document.getElementById("content");
let file = document.getElementById("file");
let score = document.getElementById("score");
let errorDiv = document.getElementById("error");

if (form) {
  form.addEventListener("submit", async (event) => {
    console.log("Form submission fired");

    title.classList.remove("inputClass");
    dueDate.classList.remove("inputClass");
    content.classList.remove("inputClass");
    file.classList.remove("inputClass");
    score.classList.remove("inputClass");
    errorDiv.hidden = true;

    if (
      !title.value.trim() ||
      !dueDate.value.trim() ||
      (!content.value.trim() && !file.value.trim()) ||
      !score.value.trim()
    ) {
      event.preventDefault();
      errorDiv.hidden = false;
      if (!title.value.trim()) {
        title.classList.add("inputClass");
      }
      if (!dueDate.value.trim()) {
        dueDate.classList.add("inputClass");
      }
      if (!content.value.trim() && !file.value.trim()) {
        content.classList.add("inputClass");
        file.classList.add("inputClass");
      }
      if (!score.value.trim()) {
        score.classList.add("inputClass");
      }
    }
  });
}
