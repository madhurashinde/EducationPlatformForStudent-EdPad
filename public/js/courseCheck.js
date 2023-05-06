let form = document.getElementById("course-registration-form");
let courseTitle = document.getElementById("courseTitle");
let courseId = document.getElementById("courseId");
let description = document.getElementById("description");
let facultyInput = document.getElementById("facultyInput");
let errorDiv = document.getElementById("error");

if (form) {
    form.addEventListener("submit", async (event) => {
        console.log("Form submission fired");

        courseTitle.classList.remove("inputClass");
        courseId.classList.remove("inputClass");
        description.classList.remove("inputClass");
        facultyInput.classList.remove("inputClass");
        errorDiv.hidden = true;

        if (
            !courseTitle.value.trim() ||
            !courseId.value.trim() ||
            !description.value.trim() ||
            !facultyInput.value.trim()
        ) {
            event.preventDefault();
            errorDiv.hidden = false;
            if (!courseTitle.value.trim()) {
                courseTitle.classList.add("inputClass");
            }
            if (!courseId.value.trim()) {
                courseId.classList.add("inputClass");
            }
            if (!description.value.trim()) {
                description.classList.add("inputClass");
            }
            if (!facultyInput.value.trim()) {
                facultyInput.classList.add("inputClass");
            }
        }
    });
}