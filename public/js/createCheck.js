let form = document.getElementById("form");
let title = document.getElementById("title");
let dueDate = document.getElementById("dueDate");
let dueTime = document.getElementById("dueTime");
let content = document.getElementById("content");
let file = document.getElementById("file");
let score = document.getElementById("score");
let errorDiv = document.getElementById("error");

if (form) {
  form.addEventListener("submit", async (event) => {
    title.classList.remove("inputClass");
    dueDate.classList.remove("inputClass");
    dueTime.classList.remove("inputClass");
    content.classList.remove("inputClass");
    file.classList.remove("inputClass");
    score.classList.remove("inputClass");
    errorDiv.hidden = true;

    if (
      !title.value.trim() ||
      !dueDate.value.trim() ||
      !dueTime.value.trim() ||
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
      if (!dueTime.value.trim()) {
        dueTime.classList.add("inputClass");
      }
      if (!content.value.trim() && !file.value.trim()) {
        content.classList.add("inputClass");
        file.classList.add("inputClass");
      }
      if (!score.value.trim()) {
        score.classList.add("inputClass");
      }
    }

    if (dueDate.value.trim() && dueTime.value.trim()) {
      const currentTime = new Date();
      const date =
        currentTime.getFullYear().toString() +
        "-" +
        (currentTime.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        currentTime.getDate().toString().padStart(2, "0");
      const time =
        currentTime.getHours().toString().padStart(2, "0") +
        ":" +
        (currentTime.getMinutes() + 1).toString().padStart(2, "0") +
        ":" +
        currentTime.getSeconds().toString().padStart(2, "0");
      const due = new Date(dueDate.value.trim() + " " + dueTime.value.trim());
      const current = new Date(date + " " + time);
      if (due.getTime() < current.getTime()) {
        event.preventDefault();
        errorDiv.hidden = false;
        dueDate.classList.add("inputClass");
        dueTime.classList.add("inputClass");
      }
    }
    if (score.value.trim()) {
      const num_score = Number(score.value);
      if (num_score === NaN || num_score < 0 || !Number.isInteger(num_score)) {
        event.preventDefault();
        errorDiv.hidden = false;
        score.classList.add("inputClass");
      }
    }
  });
}
