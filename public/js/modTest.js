let new_mod = document.getElementById("new-mod");
let courseId = document.getElementById("courseId");
let mod_title = document.getElementById("mod_title");
let mod_description = document.getElementById("mod_description");
let mod_file = document.getElementById("mod_file");
let no_title_mod = document.getElementById("no-title-mod");
let no_desc_mod = document.getElementById("no-desc-mod");
let no_file_mod = document.getElementById("no-file-mod");

if (new_mod) {
  new_mod.addEventListener("submit", (event) => {
    courseId.classList.remove("inputClass");
    mod_title.classList.remove("inputClass");
    mod_description.classList.remove("inputClass");
    mod_file.classList.remove("inputClass");
    no_title_mod.hidden = true;
    no_desc_mod.hidden = true;
    no_file_mod.hidden = true;

    const courseId_value = courseId.value;
    const mod_title_value = mod_title.value;
    const mod_description_value = mod_description.value;
    const mod_file_value = mod_file.value;

    if (!courseId_value) {
      event.preventDefault();
      courseId.classList.add("inputClass");
    }

    if (!mod_title_value) {
      event.preventDefault();
      no_title_mod.hidden = false;
      mod_title.classList.add("inputClass");
    }

    if (!mod_description_value) {
      event.preventDefault();
      no_desc_mod.hidden = false;
      mod_description.classList.add("inputClass");
    }

    if (!mod_file_value) {
      event.preventDefault();
      no_file_mod.hidden = false;
      mod_file.classList.add("inputClass");
    }
  });
}
